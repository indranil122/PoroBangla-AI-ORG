import { GoogleGenAI } from "@google/genai";
import { NoteRequest, GeneratedNote } from "../types";

/**
 * Lazy initialization helper.
 * This ensures we only access process.env.API_KEY when a request is actually made,
 * preventing 'process is not defined' errors from crashing the app at startup.
 */
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates a diagram/image using the nano banana model (gemini-2.5-flash-image).
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
          aspectRatio: "16:9", // Cinematic/landscape aspect ratio for diagrams
        }
      }
    });

    // Extract image data from the response parts
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate diagram:", error);
    return null; // Fail gracefully, the tag will just be removed or ignored
  }
}

export const generateNotes = async (request: NoteRequest): Promise<GeneratedNote> => {
  const modelId = 'gemini-2.5-flash';
  
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
    const ai = getAI();
    
    // 1. Generate Text Content
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let content = response.text || "Failed to generate notes. Please try again.";

    // 2. Parse and Generate Images for <<IMAGE_PROMPT: ...>> tags
    const imageTagRegex = /<<IMAGE_PROMPT:\s*(.*?)>>/g;
    const matches = [...content.matchAll(imageTagRegex)];

    if (matches.length > 0) {
      // Process all images in parallel
      const imageReplacements = await Promise.all(
        matches.map(async (match) => {
          const fullTag = match[0];
          const imagePrompt = match[1];
          const base64Image = await generateDiagram(imagePrompt);
          return { fullTag, base64Image, prompt: imagePrompt };
        })
      );

      // Replace tags with Markdown Images
      for (const { fullTag, base64Image, prompt } of imageReplacements) {
        if (base64Image) {
          content = content.replace(fullTag, `\n\n![${prompt}](${base64Image})\n*Figure: ${prompt}*\n\n`);
        } else {
          // If image generation failed, just remove the tag
          content = content.replace(fullTag, '');
        }
      }
    }

    return { content };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to AI service.");
  }
};