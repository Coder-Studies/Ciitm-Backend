import ChatMessage from './Chat.model.mjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import envConstant from '../../../constant/env.constant.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChatService {
  constructor() {
    this.userLastAiRequest = new Map(); // Track last AI request timestamp per user
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
      // Using Hugging Face Inference API as a free option
      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${envConstant.HUGGING_FACE_API_KEY || 'hf_demo'}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `${this.systemPrompt}\n\nStudent Question: ${question}\n\nAnswer:`,
            parameters: {
              max_length: 150,
              temperature: 0.7,
              do_sample: true,
              repetition_penalty: 1.1,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Clean up the response for speech synthesis
      let aiResponse = data[0]?.generated_text || 'I apologize, but I cannot process your question right now. Please try again later.';
      
      // Remove the original prompt and question from response
      aiResponse = aiResponse.replace(this.systemPrompt, '').replace(/Student Question:.*?Answer:/s, '').trim();
      
      // Clean up formatting for speech synthesis
      aiResponse = this.cleanResponseForSpeech(aiResponse);
      
      return aiResponse;
    } catch (error) {
      console.error('AI API Error:', error);
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
