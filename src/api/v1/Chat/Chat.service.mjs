import ChatMessage from './Chat.model.mjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import envConstant from '../../../constant/env.constant.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChatService {
  constructor() {
    this.userLastAiRequest = new Map(); // Track last AI request timestamp per user
    this.loadPrompt();
    this.initializeGemini();
  }

  initializeGemini() {
    try {
      if (!envConstant.GOOGLE_GEMINI_API_KEY) {
        console.warn('Google Gemini API key not found. AI features will be limited.');
        this.genAI = null;
        this.model = null;
        return;
      }

      this.genAI = new GoogleGenerativeAI(envConstant.GOOGLE_GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
      });
    } catch (error) {
      console.error('Error initializing Google Gemini:', error);
      this.genAI = null;
      this.model = null;
    }
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
        timestamp: messageData.timestamp || new Date(),
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
        .sort({ timestamp: -1 })
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
      timestamp: new Date().toISOString(),
      originalQuestion,
    };
  }

  isAiCommand(content) {
    return content.toLowerCase().startsWith('/ai ');
  }

  extractAiQuestion(content) {
    return content.substring(4).trim(); // Remove '/ai ' prefix
  }

  canUserRequestAi(studentId) {
    const lastRequest = this.userLastAiRequest.get(studentId);
    if (!lastRequest) return true;
    
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequest;
    const cooldownPeriod = 10000; // 10 seconds
    
    return timeSinceLastRequest >= cooldownPeriod;
  }

  updateUserAiRequestTime(studentId) {
    this.userLastAiRequest.set(studentId, Date.now());
  }

  async callAiApi(question) {
    try {
      // Check if Gemini is properly initialized
      if (!this.model) {
        console.error('Google Gemini model not initialized');
        return 'I apologize, but I cannot process your question right now. Please try again later.';
      }

      // Create the prompt with system instructions and user question
      const prompt = `${this.systemPrompt}

Student Question: ${question}

Please provide a helpful, concise answer (under 150 words) that is suitable for text-to-speech. Avoid using markdown formatting, code blocks, or special symbols. Keep the language simple and natural.

Answer:`;

      // Generate content using Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let aiResponse = response.text();

      // Clean up the response for speech synthesis
      aiResponse = this.cleanResponseForSpeech(aiResponse);

      // Ensure the response is not empty
      if (!aiResponse || aiResponse.trim().length === 0) {
        return 'I apologize, but I cannot provide a proper answer right now. Please try rephrasing your question.';
      }

      return aiResponse;
    } catch (error) {
      console.error('Google Gemini API Error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('API key')) {
        return 'AI service is currently unavailable. Please contact support.';
      }
      
      if (error.message?.includes('quota')) {
        return 'AI service quota exceeded. Please try again later.';
      }
      
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
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
      .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
      .replace(/\n/g, ' ') // Replace single newlines with space
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .replace(/^\s*[-*]\s+/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
      .trim();
  }

  async processAiRequest(studentId, username, content, avatar) {
    const question = this.extractAiQuestion(content);
    
    if (!question) {
      return this.createMessage(
        'system',
        'AI',
        'Please provide a question after /ai command. For example: /ai What is HTML?',
        '🤖',
        true
      );
    }

    if (!this.canUserRequestAi(studentId)) {
      return this.createMessage(
        'system',
        'AI',
        'Please wait 10 seconds before making another AI request.',
        '🤖',
        true
      );
    }

    this.updateUserAiRequestTime(studentId);

    try {
      const aiResponse = await this.callAiApi(question);
      
      return this.createMessage(
        studentId,
        'AI',
        aiResponse,
        '🤖',
        true,
        question
      );
    } catch (error) {
      console.error('Error processing AI request:', error);
      return this.createMessage(
        'system',
        'AI',
        'Sorry, I encountered an error. Please try again later.',
        '🤖',
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
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
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
