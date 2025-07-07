import express from 'express';
import ChatController from './Chat.controller.mjs';

const router = express.Router();

// GET /api/v1/chat/messages - Get recent messages
router.get('/v1/chat/messages', ChatController.getMessages);

// GET /api/v1/chat/stats - Get chat statistics
router.get('/v1/chat/stats', ChatController.getStats);

// DELETE /api/v1/chat/messages - Clear chat history (admin only)
router.delete('/v1/chat/messages', ChatController.clearMessages);

export { router as ChatRouter };
