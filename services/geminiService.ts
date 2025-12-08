import { GoogleGenAI, Type } from "@google/genai";
import { NoteRequest, GeneratedNote, MockTest, Question } from "../types";

// FIX: Updated AI initialization to find your Vercel/Vite key
const getAI = () => {
  // 1. Check process.env.VITE_GEMINI_API_KEY (Server-side Vercel)
  // 2. Check process.env.API_KEY (Backup standard)
  // 3. Check import.meta.env.VITE_GEMINI_API_KEY (Client-side Vite fallback)
  const apiKey = process.env.VITE_GEMINI_API_KEY || 
                 process.env.API_KEY || 
                 (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : undefined);

  if (!apiKey) {
    const errorMsg = "Configuration Error: VITE_GEMINI_API_KEY is not set.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a diagram/image using the nano banana model.
 */
async function generateDiagram(prompt: string): Promise<string | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", 
        }
      }
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.warn("Diagram generation skipped:", error);
    return null; 
  }
}

/**
 * Generates a Mock Test with multiple-choice questions.
 */
export const generateMockTest = async (topic: string, level: string, numQuestions: number): Promise<Question[]> => {
  const modelId = 'gemini-2.5-flash';
  const ai = getAI();

  const prompt = `
    Create a mock test with ${numQuestions} multiple-choice questions on the topic "${topic}" for a student at the "${level}" level.
    For each question, provide 4 options, a correct answer index (0-3), and a brief explanation for the correct answer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The question text."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 possible answers."
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "The 0-based index of the correct answer in the options array."
              },
              explanation: {
                type: Type.STRING,
                description: "A brief explanation of why the correct answer is right."
              }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    const text = response.text || "[]";
    
    // Quick cleanup just in case AI wraps response in markdown
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanText);

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
  const modelId = 'gemini-2.5-flash';
  
  const ai = getAI();
  
  const prompt = `You are an expert teacher and note-maker. The user has provided the following inputs:
– Topic: "${request.topic}"
– Standard/Class/Level: "${request.grade}"
– Language: "${request.language}"

Target Audience Adaptation (CRITICAL):
You MUST adapt the content depth, complexity, examples, and terminology specifically for the "${request.grade}" level.

Generate comprehensive, high-quality academic notes.

---
STRICT TABLE FORMATTING RULES (DO NOT IGNORE):
Whenever you show comparisons, advantages vs disadvantages, features, etc., you must use valid Markdown table syntax.

Always follow this pattern:
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1 C1 | Row 1 C2 | Row 1 C3 |
| Row 2 C1 | Row 2 C2 | Row 2 C3 |

- Exactly one row per line.
- Do not keep writing text after the last | of a row.
- Do not merge multiple logical rows into one long line.
- Never generate "fake tables" using spaces.
- If a cell needs long content, use <br> to break lines inside the cell.
- Do not add extra separator rows (| :--- |) more than once after the header.
---

DIAGRAMS & VISUALS:
If a visual diagram, chart, or scientific picture is REQUIRED to explain a concept (e.g. "Structure of an Atom", "Circuit Diagram", "Flowchart of Process"):
1. You must create a REALISTIC PROMPT for an image generation model.
2. Insert a placeholder tag in this EXACT format:
   <<IMAGE_PROMPT: A detailed, educational diagram showing [description]>>
3. Do not use this for simple decorative images. Only for educational value.
4. Limit to maximum 1-2 diagrams per note.

---

Structured Layout & Formatting (in Markdown):
- Use hierarchical headings: #, ##, ###.
- Provide a table of contents.
- Use LaTeX for ALL mathematical/chemical formulas (Always use default dark color, never white).
  - Inline: $ equation $
  - Block: $$ equation $$
- Use code blocks for all code examples.
- Use callout boxes (Definition:, Important:).

Tone & Style:
- Professional, Academic, Clear.
- No "References" or "Sources" sections.

BEGIN NOTES for (${request.topic}, ${request.grade}).`;

  try {
    // Generate Text Content
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let content = response.text;

    if (!content) {
        throw new Error("The AI returned an empty response. Please try a different topic.");
    }

    // Parse and Generate Images for <<IMAGE_PROMPT: ...>> tags
    const imageTagRegex = /<<IMAGE_PROMPT:\s*(.*?)>>/g;
    const matches = [...content.matchAll(imageTagRegex)];

    if (matches.length > 0) {
      const imageReplacements = await Promise.all(
        matches.map(async (match) => {
          const fullTag = match[0];
          const imagePrompt = match[1];
          const base64Image = await generateDiagram(imagePrompt);
          return { fullTag, base64Image, prompt: imagePrompt };
        })
      );

      for (const { fullTag, base64Image, prompt } of imageReplacements) {
        if (base64Image) {
          content = content.replace(fullTag, `\n\n![${prompt}](${base64Image})\n*Figure: ${prompt}*\n\n`);
        } else {
          content = content.replace(fullTag, '');
        }
      }
    }

    return { content };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error.message || error.toString();
    throw new Error(`AI Service Error: ${errorMessage}`);
  }
};