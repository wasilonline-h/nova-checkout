import { GoogleGenAI } from "@google/genai";
import { CartItem, Vendor } from '../types';

// We do NOT initialize 'ai' here to prevent crashing the app if the key is missing.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCartContext = async (cart: CartItem[], vendors: Record<string, Vendor>, query?: string) => {
  // check for key at runtime
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("Nova Checkout: Gemini API Key is missing in process.env.API_KEY. AI features are disabled.");
    return "I'm currently unavailable due to a configuration issue (Missing API Key). Please continue with your checkout.";
  }

  // Initialize only when needed
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const cartSummary = cart.map(item => 
    `- ${item.quantity}x ${item.title} ($${item.price}) from ${vendors[item.vendorId]?.name}`
  ).join('\n');

  const prompt = `
    You are an intelligent Checkout Concierge for a multivendor marketplace called "Nova".
    
    Current Cart Context:
    ${cartSummary}
    
    User Query: ${query || "Provide a brief, helpful analysis of this cart. Are there any missing accessories (like batteries for electronics) or bundle opportunities? Keep it short (max 2 sentences)."}
    
    Tone: Professional, helpful, concise, and sales-oriented but polite.
    If the user asks a specific question, answer it based on general ecommerce knowledge.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the concierge service right now. Please continue with your checkout.";
  }
};