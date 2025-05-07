import io from './config/Socket/SocketServer.mjs';
import express from 'express';
import app from './routes/app.mjs';
import envConstant from './constant/env.constant.mjs';
import validateEnv from './validation/Env.Validation.js';
import { db_connect } from './config/Db.config.mjs';
import path from 'path';

// import cron from 'node-cron';

import session from 'express-session';

import cookieParser from 'cookie-parser';
import lolcat from 'lolcatjs';

import cors from 'cors';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours
    },
  })
);

const whitelist = new Set([envConstant.FRONTEND_URL, 'http://localhost:5173']);

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.has(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(path.resolve(), 'public')));
app.use(
  '/api/images',
  express.static(path.join(path.resolve(), 'public', 'images'))
);

app.use((req, res, next) => {
  lolcat.fromString(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send(err.message || 'Something broke!');
  }

  next();
});

let Start_App = async () => {
  try {
    await validateEnv();

    db_connect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

app.listen(envConstant.PORT, () => {
  Start_App();
  console.log(`Server is running on port ${envConstant.PORT}`);
});
