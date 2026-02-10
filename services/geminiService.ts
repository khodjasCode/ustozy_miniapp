
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateHomework = async (topic: string, description: string) => {
  if (!API_KEY) {
    throw new Error("API Key not configured");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate an interactive English homework for the topic: "${topic}". 
    Description: "${description}". 
    Return a list of 5 tasks in different formats: fill-blanks, word-order, matching, multiple-choice.
    Keep the difficulty appropriate for the topic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { 
              type: Type.STRING,
              description: "One of: fill-blanks, word-order, matching, multiple-choice"
            },
            question: { type: Type.STRING },
            data: { 
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "For fill-blanks or word-order" },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                pairs: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      left: { type: Type.STRING },
                      right: { type: Type.STRING }
                    }
                  } 
                }
              }
            },
            correctAnswer: { type: Type.STRING, description: "The correct value or order" }
          },
          required: ["id", "type", "question", "data", "correctAnswer"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
