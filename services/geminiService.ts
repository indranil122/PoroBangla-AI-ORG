import { GoogleGenerativeAI } from "@google/generative-ai";
import { NoteRequest, GeneratedNote } from "../types";

// 1. SIMPLE & ROBUST API KEY RETRIEVAL
const getApiKey = (): string => {
  // Vercel and standard Node.js environments always use process.env
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing.");
    throw new Error(
      "Configuration Error: GEMINI_API_KEY is not set. Go to Vercel Dashboard > Settings > Environment Variables and add it."
    );
  }
  return key;
};

// 2. INITIALIZE CLIENT
const getAIClient = () => {
  const apiKey = getApiKey();
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generates a diagram using the Imagen 3 model.
 * Note: Provide a specific model intended for image generation.
 */
async function generateDiagram(prompt: string): Promise<string | null> {
  try {
    // Note: Image generation usually requires the specific Imagen model, not Gemini Flash.
    // If your API key does not have access to Imagen, this step might fail silently (returning null).
    // Currently, Imagen access via API Key is rolling out. 
    
    // START PLACEHOLDER IMPLEMENTATION
    // Since direct base64 return from `gemini-1.5-flash` for images isn't standard, 
    // we strictly strictly need to use a model capability check or an external tool.
    // For this code to work with standard Gemini keys today, we often skip image gen 
    // or use a specific specialized endpoint. 
    
    // However, here is the correct syntax if you have access to the Imagen model:
    /*
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
    const result = await model.generateContent(prompt);
    // Extract base64...
    */
    
    // FOR NOW: Returning null to prevent your app from crashing until you have Imagen access.
    // If you have access, uncomment the logic above.
    console.log("Image generation requested for:", prompt);
    return null; 

  } catch (error) {
    console.warn("Diagram generation skipped:", error);
    return null; 
  }
}

export const generateNotes = async (request: NoteRequest): Promise<GeneratedNote> => {
  // Use a stable, existing model
  const modelId = 'gemini-1.5-flash'; 
  
  const genAI = getAIClient();
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `You are an expert teacher and note-maker. The user has provided the following inputs:
– Topic: "${request.topic}"
– Standard/Class/Level: "${request.grade}"
– Language: "${request.language}"

Target Audience Adaptation (CRITICAL):
You MUST adapt the content depth, complexity, examples, and terminology specifically for the "${request.grade}" level.

Generate comprehensive, high-quality academic notes.

---
STRICT TABLE FORMATTING RULES (DO NOT IGNORE):
| Column 1 | Column 2 |
|----------|----------|
| Row 1 C1 | Row 1 C2 |

- Use Markdown tables.
- Use <br> for line breaks inside cells.
---

DIAGRAMS & VISUALS:
If a visual diagram is REQUIRED:
1. Create a descriptive prompt.
2. Insert tag: <<IMAGE_PROMPT: description>>
3. Limit to max 1-2 diagrams.

---
Structured Layout & Formatting (Markdown):
- Hierarchical headings (#, ##).
- LaTeX for Math: $ equation $ or $$ equation $$.
- Code blocks for code.

BEGIN NOTES for (${request.topic}).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();

    if (!content) {
      throw new Error("AI returned empty content.");
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
          // Remove the tag if generation failed/skipped
          content = content.replace(fullTag, '');
        }
      }
    }

    return { content };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};