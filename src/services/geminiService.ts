import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

export const generateExampleSentence = async (word: string, level: string) => {
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not found. Using static examples.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a German example sentence for the word "${word}" at CEFR level ${level}. 
      Return ONLY a JSON object with "example" (German) and "translation" (Chinese). 
      Keep it elegant and contextually appropriate for a macaron-themed learning app.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text);
    return data as { example: string; translation: string };
  } catch (error) {
    console.error("Error generating example sentence:", error);
    return null;
  }
};
