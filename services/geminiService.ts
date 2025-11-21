import { GoogleGenAI, Type } from "@google/genai";
import { IslandLore } from "../types";

export const analyzeIslandImage = async (base64Image: string): Promise<IslandLore> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
        { text: "Analyze this image and generate island lore." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          element: { type: Type.STRING },
          dangerLevel: { type: Type.STRING },
          inhabitants: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "description", "element", "dangerLevel", "inhabitants"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response");
  
  return JSON.parse(text) as IslandLore;
};