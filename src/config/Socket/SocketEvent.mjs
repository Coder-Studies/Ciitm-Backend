import FrontendSocket from '../../api/v1/frontend/frontend.socket.mjs';
import DashBoard_Socket from '../../api/v1/Dashboard/Dashbord.socket.mjs';
import io from './SocketServer.mjs';
import StudentSocket from '../../api/v1/Student/Student.Socket.mjs';

let SocketEvent = (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  FrontendSocket(io, socket);
  DashBoard_Socket(io, socket);
  StudentSocket(io, socket);

  socket.emit('welcome', { message: 'Welcome to the Socket.IO Server' });
};

export default SocketEvent;
