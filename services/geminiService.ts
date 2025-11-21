import { GoogleGenAI, Type } from "@google/genai";
import { IslandLore } from "../types";

export const analyzeIslandImage = async (base64Image: string): Promise<IslandLore> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Remove header if present in base64 string
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        },
        {
          text: "Analyze this image of a floating fantasy island. Create a creative lore description for it. Return JSON."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "A mystical name for the island" },
          description: { type: Type.STRING, description: "A 2 sentence poetic description of the scenery" },
          element: { type: Type.STRING, description: "The primary magical element (Air, Water, Nature, Void)" },
          dangerLevel: { type: Type.STRING, description: "Safe, Moderate, or Deadly" },
          inhabitants: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "List of 3 mythical creatures likely to live there" 
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as IslandLore;
};
