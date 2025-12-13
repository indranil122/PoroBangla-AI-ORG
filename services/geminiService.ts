import { GoogleGenAI } from "@google/genai";
import { NoteRequest, GeneratedNote, MockTest, Question, GeneratedFlashcard } from "../types";

// HELPER: Cleans AI output to ensure JSON.parse doesn't fail
const cleanJson = (text: string): string => {
  if (!text) return "{}";
  // Remove markdown code blocks if present
  let clean = text.replace(/```json/g, "").replace(/```/g, "");
  return clean.trim();
};

// FIX: Robust API Key Initialization for Vercel/Vite
const getAI = () => {
  // 1. Check process.env.VITE_GEMINI_API_KEY (Server-side Vercel/Node)
  // 2. Check process.env.API_KEY (Backup standard)
  // 3. Check import.meta.env.VITE_GEMINI_API_KEY (Client-side Vite fallback)
  const apiKey = process.env.VITE_GEMINI_API_KEY || 
                 process.env.API_KEY || 
                 (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : undefined);

  if (!apiKey) {
    const errorMsg = "Configuration Error: API Key is missing. Please check VITE_GEMINI_API_KEY in your environment variables.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a Mock Test with multiple-choice questions.
 */
export const generateMockTest = async (topic: string, level: string, numQuestions: number): Promise<Question[]> => {
  // Using gemini-2.5-flash for speed and efficiency
  const modelId = 'gemini-2.5-flash';
  const ai = getAI();

  // Enhanced prompt for "Best in Class" generation
  const prompt = `
    Act as a world-class academic examiner and subject matter expert. 
    Design a high-quality, rigorous mock test on the topic "${topic}" specifically tailored for a "${level}" level student.
    
    Generate exactly ${numQuestions} multiple-choice questions.

    CRITICAL QUALITY GUIDELINES:
    1. **Cognitive Depth & Variety**: 
       - Move beyond simple definition recall. 
       - Include questions that require **Analysis** (comparing concepts), **Application** (scenarios/problem solving), and **Critical Thinking** appropriate for the "${level}" level.
    
    2. **Distractor Engineering (Wrong Answers)**:
       - The wrong options (distractors) MUST be plausible and realistic to test deep understanding. 
       - Avoid obviously incorrect, silly, or "filler" answers.
       - Distractors should target common misconceptions or near-miss logic relevant to the subject.
    
    3. **Educational Value**: 
       - The explanation provided for the correct answer should be clear, concise, and educational.
       - Where applicable, explain *why* the distractor is wrong to reinforce learning.

    4. **Format**: Return ONLY valid JSON matching the specified schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        // FIX: Use string literals for schema types
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: {
                type: 'STRING',
                description: "The question text. Ensure it is clear, unambiguous, and academically rigorous."
              },
              options: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: "An array of exactly 4 options. One correct answer and three highly plausible distractors."
              },
              correctAnswerIndex: {
                type: 'INTEGER',
                description: "The 0-based index of the correct answer in the options array."
              },
              explanation: {
                type: 'STRING',
                description: "A helpful, educational explanation of why the correct answer is right and/or why others are wrong."
              }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    const text = response.text || "[]";
    
    // Quick cleanup just in case AI wraps response in markdown
    const questions = JSON.parse(cleanJson(text));

    // Validate the structure
    if (!Array.isArray(questions) || questions.some(q => q.options.length !== 4)) {
      throw new Error("AI returned an invalid test format.");
    }

    return questions;

  } catch (error) {
    console.error("Mock Test Generation Error:", error);
    throw new Error("Failed to generate mock test. The AI response may have been malformed or blocked.");
  }
};

export const generateNotes = async (request: NoteRequest): Promise<GeneratedNote> => {
  // Use gemini-2.5-flash for complex STEM topics to ensure depth and reduce cut-off risk.
  const modelId = 'gemini-2.5-flash';
  
  const ai = getAI();
  
  const prompt = `You are a distinguished academic professor and expert textbook author. 
The user requires a comprehensive, deep-dive set of notes on:
– Topic: "${request.topic}"
– Level: "${request.grade}"
– Language: "${request.language}"

OBJECTIVE:
Generate a detailed, chapter-level academic resource.
Do not provide a mere summary. Provide extensive explanations, derivations, examples, and context.
You have a large output limit—utilize it to cover the topic thoroughly.

CRITICAL INSTRUCTION FOR COMPLETENESS:
Ensure the notes have a proper introduction, body, and conclusion. 
Do not stop abruptly. If the topic is vast, prioritize the most critical core concepts and ensure the final section wraps up logically.

---
FORMATTING INSTRUCTIONS:
- **Do NOT use Markdown tables** (e.g., | Col | Col |). They do not render correctly in this environment.
- Instead, present comparisons or structured data using **Bulleted Lists** or **Definition Lists**.
  Example:
  **Comparison: A vs B**
  * **Feature 1**: A has X, whereas B has Y.
  * **Feature 2**: A is slow, B is fast.

- Use # for Title, ## for Main Sections, ### for Subsections.
- Use LaTeX for ALL math/science formulas:
  - Inline: $ E = mc^2 $
  - Block: $$ \nabla \cdot E = \frac{\rho}{\epsilon_0} $$
- Use **bold** for key terms.
- Use blockquotes (>) for definitions or key takeaways.
- Do not use placeholders for images.

TONE:
- Authoritative, Educational, Clear, and Rigorous.

BEGIN NOTES for (${request.topic}).`;

  try {
    // Generate Text Content
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        // Removed googleSearch tool to prevent errors if not enabled on API key
        maxOutputTokens: 8192, // Maximize token budget
      }
    });

    const content = response.text;

    if (!content) {
        throw new Error("The AI returned an empty response. Please try a different topic.");
    }

    // Extract sources from grounding metadata if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let sources: { uri: string; title: string }[] = [];

    if (groundingMetadata?.groundingChunks) {
      sources = groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri && web.title)
        .map((web: any) => ({ uri: web.uri, title: web.title }));
      
      // Remove duplicates based on URI
      sources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);
    }

    return { content, sources };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error.message || error.toString();
    throw new Error(`AI Service Error: ${errorMessage}`);
  }
};

export const generateFlashcards = async (topic: string, context: string): Promise<GeneratedFlashcard[]> => {
  const modelId = 'gemini-2.5-flash';
  const ai = getAI();

  const prompt = `
    Create a set of 10-15 high-quality flashcards for the topic "${topic}".
    ${context ? `Use the following context as a primary source:\n${context}\n` : ''}

    Return a JSON array of objects. Each object must have:
    - front: The question or concept (concise).
    - back: The answer or definition (clear and accurate).
    - cardType: One of "Basic", "Concept", "Fact".
    - tags: An array of 1-3 short keyword tags related to the card.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        // FIX: Use string literals for schema types
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              front: { type: 'STRING' },
              back: { type: 'STRING' },
              cardType: { type: 'STRING' },
              tags: { type: 'ARRAY', items: { type: 'STRING' } }
            },
            required: ["front", "back", "cardType", "tags"]
          }
        }
      }
    });

    const text = response.text || "[]";
    const cards = JSON.parse(cleanJson(text));

    if (!Array.isArray(cards)) {
        throw new Error("Invalid response format from AI");
    }

    return cards;
  } catch (error) {
    console.error("Flashcard Generation Error:", error);
    throw new Error("Failed to generate flashcards.");
  }
};