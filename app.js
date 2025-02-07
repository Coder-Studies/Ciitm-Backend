import cron from 'node-cron';
import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import lolcat from 'lolcatjs';
import path from 'path';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import db_connect from './src/middleware/db.connect.js';
import routerMiddleWare from './src/middleware/router.middleware.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Notice from './src/models/Notice.model.js';
import validateEnv from './src/validation/Env.Validation.js';

dotenv.config({
  path: '.env',
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(cookieParser());

// Session middleware

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

cron.schedule('0 0 31 12 *', async () => {
  try {
    const now = new Date();
    await Notice.deleteMany({ expiryDate: { $lt: now } });
  } catch (err) {
    console.error('Error deleting expired notices:', err);
  }
});

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: 'Too many requests from this IP, please try again after 15 minutes',
//   headers: true,
//   legacyHeaders: false,
//   standardHeaders: 'draft-8',
// });

// app.use(limiter);


const whitelist = new Set([process.env.website_URL , 'http://localhost:5173']);

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.has(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Set the view engine (EJS)
console.log(__dirname);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(
  '/api/images',
  express.static(path.join(path.resolve(), 'public', 'images'))
);

// Middleware to log messages with lolcat
app.use((req, res, next) => {
  lolcat.fromString(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(routerMiddleWare);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send(err.message || 'Something broke!');
  }

  next();
});

// db_connect

let Start_App = async () => {
  try {
    await validateEnv();

    db_connect()
      .then(() => {})
      .catch((err) => {
        console.log(err.message);
      });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
Start_App();

export default app;
