import ChatService from './Chat.service.mjs';
import AuthUtility from '../Auth/Auth.utils.mjs';
const ChatSocket = (io, socket) => {
  console.log('Chat socket connected:', socket.id);

  // Join the chat room
  socket.join('chat-room');

  // Sending recent messages to newly connected user
  socket.on('requestRecentMessages', async () => {
    try {
      const recentMessages = await ChatService.getRecentMessages(50);
      console.log('Recent messages sent to user:', recentMessages);
      socket.emit('recentMessages', recentMessages);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      socket.emit('error', { message: 'Failed to fetch recent messages' });
    }
  });

  // Handle new message
  socket.on('newMessage', async (data) => {
    try {
      const { studentId, username, content, avatar, token } = data;
      console.log(`New message from ${username} (${studentId}):`, content);

      // Validate input
      if (!studentId || !username || !content) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      // Validate content length
      if (content.length > 500) {
        socket.emit('error', {
          message: 'Message too long. Maximum 500 characters allowed.',
        });
        return;
      }

      // Optional: Verify token if provided
      if (token) {
        try {
          const email = await AuthUtility.DecodeToken(token);

          if (!email) {
            socket.emit('error', { message: 'Invalid token' });
            return;
          }
        } catch (error) {
          socket.emit('error', { message: 'Authentication failed' });
          return;
        }
      }

      // Create and save user message
      const userMessage = ChatService.createMessage(
        studentId,
        username,
        content,
        avatar || '🧑'
      );

      await ChatService.saveMessage(userMessage);

      // Broadcast user message to all clients
      io.to('chat-room').emit('messageReceived', userMessage);

      // Check if it's an AI command
      if (ChatService.isAiCommand(content)) {
        // Send "AI is typing" indicator
        io.to('chat-room').emit('aiTyping', { isTyping: true });

        // Add a small delay for better UX
        setTimeout(async () => {
          try {
            const aiResponse = await ChatService.processAiRequest(
              studentId,
              username,
              content,
              avatar
            );

            // Save AI response
            await ChatService.saveMessage(aiResponse);

            // Stop typing indicator
            io.to('chat-room').emit('aiTyping', { isTyping: false });

            // Broadcast AI response
            io.to('chat-room').emit('messageReceived', aiResponse);
          } catch (error) {
            console.error('Error processing AI request:', error);
            io.to('chat-room').emit('aiTyping', { isTyping: false });

            const errorMessage = ChatService.createMessage(
              'system',
              'AI',
              'Sorry, I encountered an error. Please try again later.',
              '🤖',
              true
            );

            io.to('chat-room').emit('messageReceived', errorMessage);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error handling new message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  // Handle user joining chat
  socket.on('userJoinedChat', (data) => {
    const { username, studentId } = data;
    console.log(`User joined chat: ${username} (${studentId})`);
    if (username && studentId) {
      socket.to('chat-room').emit('userJoinedNotification', {
        username,
        studentId,
      });
    }
  });

  // Handle user leaving chat
  socket.on('userLeftChat', (data) => {
    const { username, studentId } = data;
    if (username && studentId) {
      socket.to('chat-room').emit('userLeftNotification', {
        username,
        studentId,
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Chat socket disconnected:', socket.id);
    socket.leave('chat-room');
  });
};

export default ChatSocket;
