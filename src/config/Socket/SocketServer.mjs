import { readFileSync } from 'fs';
import { createServer } from 'https';
import path from 'path';
import { Server } from 'socket.io';

console.log(path.resolve());

let Keypath = path.join(path.resolve(), 'src/key');

const httpsServer = createServer({
  key: readFileSync(`${Keypath}/key.pem`),
  cert: readFileSync(`${Keypath}/cert.pem`),
});

const io = new Server(httpsServer, {
  cors: {
    origin: ['http://localhost:5173', 'https://www.growrichmindset.in/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  allowEIO3: true, // Allow Engine.IO v3 clients to connect
});

let SocketPort = 3000;

httpsServer.listen(SocketPort, () => {
  console.log(`Socket server is running on port ${SocketPort}`);
});

export default io;
