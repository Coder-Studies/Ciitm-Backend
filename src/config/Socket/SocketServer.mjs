import { readFileSync } from 'fs';
import { createServer } from 'https';
import path from 'path';
import { Server } from 'socket.io';
import envConstant from '../../constant/env.constant.mjs';
import app from '../../routes/app.mjs';
import validateEnv from '../../validation/Env.Validation.mjs';
import { db_connect } from '../Db.config.mjs';

console.log(path.resolve());

const Keypath = path.join(path.resolve(), 'src/key');

// ✅ Create HTTPS server and attach Express app
const httpsServer = createServer(
  {
    key: readFileSync(`${Keypath}/key.pem`),
    cert: readFileSync(`${Keypath}/cert.pem`),
  },
  app
);

const io = new Server(httpsServer, {
  cors: {
    origin: ['http://localhost:5173', 'https://www.growrichmindset.in'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true,
});

const PORT = process.env.PORT || envConstant.PORT || 8000;


let Start_App = async () => {
  try {
    await validateEnv();

    db_connect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// ✅ Start the unified server
httpsServer.listen(PORT , '0.0.0.0', () => {
  console.log(`✅ HTTPS + WS server running on port ${PORT}`);
  Start_App();
});

export default io;
