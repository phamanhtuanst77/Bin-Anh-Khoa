
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export class GeminiService {
  private chat: Chat;

  constructor() {
    this.chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string, onChunk: (text: string) => void): Promise<string> {
    try {
      const responseStream = await this.chat.sendMessageStream({ message });
      let fullText = '';
      
      for await (const chunk of responseStream) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onChunk(fullText);
      }
      
      return fullText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  static async quickTopicInit(topicTitle: string): Promise<string> {
    const tempAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await tempAi.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Hãy trình bày chuyên đề "${topicTitle}" theo đúng quy trình 7 bước vàng.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    return response.text || "Xin lỗi, đã có lỗi xảy ra.";
  }
}

export const gemini = new GeminiService();
