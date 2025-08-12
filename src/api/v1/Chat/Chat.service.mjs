import ChatMessage from './Chat.model.mjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import envConstant from '../../../constant/env.constant.mjs';
import Redis from 'ioredis';
import { GoogleGenAI } from '@google/genai'; // <-- updated import

const AI_REQUEST_COOLDOWN_MS = 10000; // 10 seconds
const RECENT_MESSAGES_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const redis = new Redis(envConstant.REDIS_URL || 'redis://localhost:6379');

const GEMINI_API_KEY = envConstant.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('Google Gemini API key (GEMINI_API_KEY) is missing. Please set it in your environment variables.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 

class ChatService {
  constructor() {
    this.loadPrompt();
  }

  loadPrompt() {
    try {
      const promptPath = path.join(__dirname, '../../../../prompt.txt');
      this.systemPrompt = fs.readFileSync(promptPath, 'utf8');
    } catch (error) {
      console.error('Error loading prompt.txt:', error);
      this.systemPrompt = 'You are a helpful student assistant for CIITM Dhanbad. Provide concise, clear answers without formatting.';
    }
  }

  async saveMessage(messageData) {
    try {
      const message = new ChatMessage({
        messageId: messageData.id,
        studentId: messageData.studentId,
        username: messageData.username,
        avatar: messageData.avatar,
        content: messageData.content,
        isAI: messageData.isAI || false,
        originalQuestion: messageData.originalQuestion || null,
      });

      await message.save();
      return message;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  async getRecentMessages(limit = 50) {
    try {
      const messages = await ChatMessage.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-_id -__v -createdAt -updatedAt');

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  createMessage(studentId, username, content, avatar = '🧑', isAI = false, originalQuestion = null) {
    return {
      id: uuidv4(),
      studentId,
      username,
      avatar,
      content: content.trim(),
      isAI,
      originalQuestion,
    };
  }

  isAiCommand(content) {
    return content.toLowerCase().startsWith('/ai ');
  }

  extractAiQuestion(content) {
    return content.substring(4).trim(); // Remove '/ai ' prefix
  }

  async canUserRequestAi(studentId) {
    const lastRequest = await redis.get(`chat:lastAiRequest:${studentId}`);
    if (!lastRequest) return true;

    const now = Date.now();
    const timeSinceLastRequest = now - Number(lastRequest);

    return timeSinceLastRequest >= AI_REQUEST_COOLDOWN_MS;
  }

  async updateUserAiRequestTime(studentId) {
    await redis.set(`chat:lastAiRequest:${studentId}`, Date.now());
  }

  async callAiApi(question) {
    try {
      // Use Google Gemini (Generative AI) for response
      const prompt = `${this.systemPrompt}\n\nStudent Question: ${question}\n\nAnswer:`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // or 'gemini-1.5-flash' as needed
  
        contents: prompt,
      });
      let aiResponse = response.text;
  
      aiResponse = this.cleanResponseForSpeech(aiResponse);
      return aiResponse || 'I apologize, but I cannot process your question right now. Please try again later.';
    } catch (error) {
      console.error('Gemini AI API Error:', error);
      return 'I apologize, but I cannot process your question right now. Please try again later.';
    }
  }

  cleanResponseForSpeech(text) {
    // Remove markdown formatting and symbols that interfere with speech
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code backticks
      .replace(/#{1,6}\s/g, '') // Remove header symbols
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
      .replace(/\n/g, ' ') // Replace single newlines with space
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  async processAiRequest(studentId, username, content, avatar) {
    const question = this.extractAiQuestion(content);
    
    if (!question) {
      return this.createMessage(
        'system',
        'AI',
        'Please provide a question after /ai command. For example: /ai What is HTML?',
        'https://img.freepik.com/premium-photo/ai-human-technology-background_1409-5588.jpg',
        true
      );
    }

    if (!await this.canUserRequestAi(studentId)) {
      return this.createMessage(
        'system',
        'AI',
        'Please wait 10 seconds before making another AI request.',
        'https://media.istockphoto.com/id/1957053641/vector/cute-kawaii-robot-character-friendly-chat-bot-assistant-for-online-applications-cartoon.jpg?s=612x612&w=0&k=20&c=Uf7lcu3I_ZNQvjBWxlFenRX7FuG_PKVJ4y1Y11aTZUc=',
        true
      );
    }

    await this.updateUserAiRequestTime(studentId);

    try {
      const aiResponse = await this.callAiApi(question);
      
      return this.createMessage(
        studentId,
        'AI',
        aiResponse,
        'https://media.istockphoto.com/id/1957053641/vector/cute-kawaii-robot-character-friendly-chat-bot-assistant-for-online-applications-cartoon.jpg?s=612x612&w=0&k=20&c=Uf7lcu3I_ZNQvjBWxlFenRX7FuG_PKVJ4y1Y11aTZUc=',
        true,
        question
      );
    } catch (error) {
      console.error('Error processing AI request:', error);
      return this.createMessage(
        'system',
        'AI',
        'Sorry, I encountered an error. Please try again later.',
        'https://cdn-icons-png.freepik.com/256/6639/6639444.png?semt=ais_white_label',
        true
      );
    }
  }

  async clearAllMessages() {
    try {
      const result = await ChatMessage.deleteMany({});
      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  }

  async getChatStats() {
    try {
      const totalMessages = await ChatMessage.countDocuments();
      const aiMessages = await ChatMessage.countDocuments({ isAI: true });
      const userMessages = totalMessages - aiMessages;
      
      const recentMessages = await ChatMessage.countDocuments({
        createdAt: { $gte: new Date(Date.now() - RECENT_MESSAGES_WINDOW_MS) } // Last 24 hours
      });

      const topUsers = await ChatMessage.aggregate([
        { $match: { isAI: false } },
        { $group: { _id: '$username', messageCount: { $sum: 1 } } },
        { $sort: { messageCount: -1 } },
        { $limit: 10 }
      ]);

      return {
        totalMessages,
        userMessages,
        aiMessages,
        recentMessages,
        topUsers
      };
    } catch (error) {
      console.error('Error getting chat stats:', error);
      throw error;
    }
  }
}

export default new ChatService();
