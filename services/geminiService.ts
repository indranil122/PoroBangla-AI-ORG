import { GoogleGenAI, Type } from "@google/genai";
import {
  NoteRequest,
  GeneratedNote,
  Question,
  GeneratedFlashcard,
  StudyGuideRequest,
  StudyGuideResponse
} from "../types";

/* ------------------------------------------------------------------ */
/*  VITE-SAFE GEMINI CLIENT                                           */
/* ------------------------------------------------------------------ */

const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_GEMINI_API_KEY is missing. Add it in Vercel Environment Variables."
    );
  }

  return new GoogleGenAI({ apiKey });
};

/* ------------------------------------------------------------------ */
/*  HELPER: CLEAN JSON OUTPUT                                          */
/* ------------------------------------------------------------------ */

const cleanJson = (text?: string): string => {
  if (!text) return "[]";

  let clean = text.replace(/```json|```/g, "").trim();

  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");

  if (start !== -1 && end !== -1) {
    clean = clean.slice(start, end + 1);
  }

  return clean;
};

/* ------------------------------------------------------------------ */
/*  MOCK TEST GENERATION                                               */
/* ------------------------------------------------------------------ */

export const generateMockTest = async (
  topic: string,
  level: string,
  numQuestions: number
): Promise<Question[]> => {
  const ai = getGeminiClient();

  const prompt = `
    Act as a world-class academic examiner.
    Design a mock test on "${topic}" for a "${level}" level.
    Generate exactly ${numQuestions} multiple-choice questions.
    Return the response as a valid JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: [
              "question",
              "options",
              "correctAnswerIndex",
              "explanation"
            ]
          }
        }
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (error) {
    console.error("Mock Test Generation Error:", error);
    throw new Error("Failed to generate mock test.");
  }
};

/* ------------------------------------------------------------------ */
/*  NOTES GENERATION                                                   */
/* ------------------------------------------------------------------ */

export const generateNotes = async (
  request: NoteRequest
): Promise<GeneratedNote> => {
  const ai = getGeminiClient();

  const prompt = `
    You are a distinguished academic professor from PoroBangla AI.
    Generate comprehensive academic notes on "${request.topic}"
    for "${request.grade}" level in "${request.language}".

    Use:
    - Clear headers (H1, H2, H3)
    - Bullet points
    - LaTeX for formulas
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const content = response.text || "";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    const sources =
      groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        ?.filter((web: any) => web?.uri && web?.title)
        ?.map((web: any) => ({
          uri: web.uri,
          title: web.title
        })) || [];

    return { content, sources };
  } catch (error) {
    console.error("Note Generation Error:", error);
    throw new Error("Failed to generate notes.");
  }
};

/* ------------------------------------------------------------------ */
/*  FLASHCARD GENERATION                                               */
/* ------------------------------------------------------------------ */

export const generateFlashcards = async (
  topic: string,
  context: string
): Promise<GeneratedFlashcard[]> => {
  const ai = getGeminiClient();

  const prompt = `
    Create 10–15 high-quality academic flashcards for "${topic}".
    ${context ? `Context: ${context}` : ""}
    Return the response as a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              cardType: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["front", "back", "cardType", "tags"]
          }
        }
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (error) {
    console.error("Flashcard Generation Error:", error);
    throw new Error("Failed to generate flashcards.");
  }
};

/* ------------------------------------------------------------------ */
/*  STUDY GUIDE GENERATION                                             */
/* ------------------------------------------------------------------ */

export const generateStudyGuide = async (
  req: StudyGuideRequest
): Promise<StudyGuideResponse> => {
  const ai = getGeminiClient();

  const prompt = `
    Act as a dedicated personal tutor from PoroBangla AI.
    Create a highly structured ${req.days}-day study guide for "${req.topic}".

    Target Level: ${req.level}
    User Goals/Context: ${req.details}

    Format with Day X headers and daily practice challenges.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return {
      content: response.text || "",
      summary: `A strategic ${req.days}-day learning path for ${req.topic}.`
    };
  } catch (error) {
    console.error("Study Guide Generation Error:", error);
    throw new Error("Failed to generate study guide.");
  }
};
