import ChatService from './Chat.service.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';

class ChatController {
  // Get chat history
  getMessages = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const messages = await ChatService.getRecentMessages(limit);
      
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Messages retrieved successfully',
        messages
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        'Failed to retrieve messages'
      );
    }
  };

  // Clear chat history (admin only)
  clearMessages = async (req, res) => {
    try {
      // This would typically include authentication check for admin
      const result = await ChatService.clearAllMessages();
      
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Chat history cleared successfully',
        result
      );
    } catch (error) {
      console.error('Error clearing messages:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        'Failed to clear messages'
      );
    }
  };

  // Get chat statistics
  getStats = async (req, res) => {
    try {
      const stats = await ChatService.getChatStats();
      
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Chat statistics retrieved successfully',
        stats
      );
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        'Failed to retrieve chat statistics'
      );
    }
  };
}

export default new ChatController();
