let SocketEvent = (socket) => {

    console.log('A user connected:', socket.id);


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    
    socket.emit('welcome', { message: 'Welcome to the Socket.IO' })
  
}

export default SocketEvent;