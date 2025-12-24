import { GoogleGenAI } from "@google/genai";
import { NoteRequest, GeneratedNote, MockTest, Question, GeneratedFlashcard, StudyGuideRequest, StudyGuideResponse } from "../types";

// HELPER: Cleans AI output to ensure JSON.parse doesn't fail
const cleanJson = (text: string): string => {
  if (!text) return "{}";
  // Remove markdown code blocks if present
  let clean = text.replace(/```json/g, "").replace(/```/g, "");
  return clean.trim();
};

/**
 * Robust API Key Initialization
 * Checks VITE_GEMINI_API_KEY (Vite standard) first, then falls back to process.env.
 */
const getAI = () => {
  // Use 'any' cast to prevent TypeScript errors in different build environments
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    console.error("Configuration Error: API Key is missing. Ensure VITE_GEMINI_API_KEY is set in Vercel.");
    throw new Error("AUTH_ERROR: API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMockTest = async (topic: string, level: string, numQuestions: number): Promise<Question[]> => {
  const modelId = 'gemini-2.0-flash'; // Updated to latest stable flash model
  const ai = getAI();

  const prompt = `
    Act as a world-class academic examiner. 
    Design a mock test on "${topic}" for a "${level}" level.
    Generate exactly ${numQuestions} multiple-choice questions.
    Return valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // FIX: Using string literals instead of Type enum to prevent Vercel build errors
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              options: { type: 'ARRAY', items: { type: 'STRING' } },
              correctAnswerIndex: { type: 'INTEGER' },
              explanation: { type: 'STRING' }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });
    return JSON.parse(cleanJson(response.text || "[]"));
  } catch (error) {
    console.error("Mock Test Generation Error:", error);
    throw new Error("Failed to generate mock test.");
  }
};

export const generateNotes = async (request: NoteRequest): Promise<GeneratedNote> => {
  const modelId = 'gemini-2.0-flash';
  const ai = getAI();
  const prompt = `You are a distinguished academic professor at PoroBangla AI. 
  Generate comprehensive notes on "${request.topic}" for "${request.grade}" level in "${request.language}". 
  Use LaTeX for ALL math/science formulas ($E=mc^2$). Do not use tables. Use bullet points for comparisons.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Grounding with search
      }
    });
    const content = response.text || "";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let sources: { uri: string; title: string }[] = [];
    if (groundingMetadata?.groundingChunks) {
      sources = groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri && web.title)
        .map((web: any) => ({ uri: web.uri, title: web.title }));
    }
    return { content, sources };
  } catch (error) {
    console.error("Note Generation Error:", error);
    throw new Error("Failed to generate notes.");
  }
};

export const generateFlashcards = async (topic: string, context: string): Promise<GeneratedFlashcard[]> => {
  const modelId = 'gemini-2.0-flash';
  const ai = getAI();
  const prompt = `Create 10-15 high-quality flashcards for "${topic}". ${context ? `Context: ${context}` : ''}`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
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
    return JSON.parse(cleanJson(response.text || "[]"));
  } catch (error) {
    console.error("Flashcard Error:", error);
    throw new Error("Failed to generate flashcards.");
  }
};

export const generateStudyGuide = async (req: StudyGuideRequest): Promise<StudyGuideResponse> => {
  const modelId = 'gemini-2.0-flash-thinking-preview'; 
  const ai = getAI();
  const prompt = `
    Act as a dedicated personal tutor from PoroBangla AI. Create a ${req.days}-day study guide for "${req.topic}".
    Target Level: ${req.level}. Detail: ${req.details}.
    Format with Day X headers and use bolding for key terms.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return {
      content: response.text || "",
      summary: `A ${req.days}-day masterclass plan for ${req.topic}.`
    };
  } catch (error) {
    console.error("Study Guide Error:", error);
    throw new Error("Failed to generate study guide.");
  }
};