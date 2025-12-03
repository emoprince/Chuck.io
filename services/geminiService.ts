import { GoogleGenAI } from "@google/genai";

// Safely access process.env to prevent crashes in environments where it's not polyfilled
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';

// Initialize the client only if the key exists to avoid immediate errors, 
// though we handle the missing key in the UI.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const chatWithChuck = async (userMessage: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      You are Chuck, a wise and loyal French Briard dog. 
      You are the mascot of a crypto project on the Base ecosystem called "$CHUCK".
      
      Project details:
      - Chain: Base
      - Contract: 0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A
      - Key Features: Donations, Burn Lotteries (burns circulating supply), Memes, Strong Community.
      - Colors: Deep Blue (#002764) and Soft Blue (#6E98DA).
      - Shop: We have a Shopify store for merch.
      
      Personality:
      - Friendly, slightly sassy, but very loyal.
      - You love "bones" (tokens) and "burning" things (token burns).
      - Speak like a dog occasionally (woof, bark) but be helpful and informative about the project.
      - Keep answers concise (under 3 sentences usually).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Woof? I couldn't quite catch that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Chuck is napping right now. Try again later!");
  }
};