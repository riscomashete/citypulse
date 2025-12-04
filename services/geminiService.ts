import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real app this would come from environment
// NOTE: Since this is a client-side demo without a backend proxy, 
// we will assume the key is present or the feature is disabled/mocked if missing.

// Helper to safely use the API
export const GeminiService = {
  generateArticleContent: async (topic: string, category: string): Promise<string> => {
    if (!apiKey) {
      console.warn("Gemini API Key missing");
      return "## AI Generation Unavailable\n\nPlease configure the API key to use this feature.";
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a comprehensive news article about "${topic}" for the "${category}" section. 
        Format it in Markdown. Include a catchy headline as the first h1 header (#), followed by the content. 
        Keep it professional, engaging, and around 300 words.`,
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error generating content. Please try again.";
    }
  },

  summarizeArticle: async (content: string): Promise<string> => {
    if (!apiKey) return "";
     try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following article in 2-3 sentences for an excerpt:\n\n${content}`,
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "";
    }
  }
};