
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Correction } from '../types';

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const getCodeCorrection = async (
  language: Language,
  code: string,
  errorMessage: string
): Promise<Correction> => {
    try {
        const ai = getAiInstance();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                You are an expert programmer and code debugger.
                A user has provided a piece of ${language} code that resulted in an error.
                Your task is to fix the code and provide a brief, clear explanation of the error and your correction.

                Original Code:
                \`\`\`${language}
                ${code}
                \`\`\`

                Error Message:
                \`\`\`
                ${errorMessage}
                \`\`\`

                Please provide your response in the specified JSON format.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        correctedCode: {
                            type: Type.STRING,
                            description: "The corrected, fully functional code snippet."
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "A brief explanation of the error and the fix applied."
                        }
                    },
                    required: ["correctedCode", "explanation"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        return {
            correctedCode: parsedResponse.correctedCode,
            explanation: parsedResponse.explanation
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            correctedCode: `// AI could not process the code.`,
            explanation: "There was an issue with the AI correction service. Please try again later."
        };
    }
};
