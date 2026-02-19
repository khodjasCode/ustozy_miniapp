
import { GoogleGenAI, Type } from "@google/genai";

export const generateHomework = async (topic: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 interactive English tasks for the topic: "${topic}". 
    ${description ? `Context: ${description}` : ''}
    
    CRITICAL RULES:
    1. For 'fill-blanks' type: The text MUST contain exactly one placeholder "[___]".
    2. Every task MUST have 4 strings in the 'options' array.
    3. The 'correctAnswer' MUST be exactly one of the strings from the 'options' array.
    4. Make it fun and educational.`,
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
              description: "One of: fill-blanks, multiple-choice"
            },
            question: { type: Type.STRING, description: "Instruction for the student" },
            data: { 
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "Required for fill-blanks. Example: 'I want to eat [___] apple.'" },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "4 possible answers to choose from"
                }
              },
              required: ["options"]
            },
            correctAnswer: { type: Type.STRING, description: "The exact string from options" }
          },
          required: ["id", "type", "question", "data", "correctAnswer"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response text received from Gemini API");
  }
  return JSON.parse(text.trim());
};
