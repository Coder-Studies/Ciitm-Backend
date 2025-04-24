import express from 'express';
import app from './routes/app.mjs';
import envConstant from './constant/env.constant.mjs';
import validateEnv from './validation/Env.Validation.js';
import { db_connect } from './config/Db.config.mjs';
import path from 'path';

// import cron from 'node-cron';
// import createError from 'http-errors';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import lolcat from 'lolcatjs';

// import cors from 'cors';
// // import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// // import Notice from './models/Notice.model.js';

// dotenv.config({
//   path: '.env',
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());

app.use(cookieParser());

// // Session middleware

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

// // cron.schedule('0 0 31 12 *', async () => {
// //   try {
// //     const now = new Date();
// //     await Notice.deleteMany({ expiryDate: { $lt: now } });
// //   } catch (err) {
// //     console.error('Error deleting expired notices:', err);
// //   }
// // });

// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100,
// //   message: 'Too many requests from this IP, please try again after 15 minutes',
// //   headers: true,
// //   legacyHeaders: false,
// //   standardHeaders: 'draft-8',
// // });

// // server.use(limiter);

// const whitelist = new Set([envConstant.FRONTEND_URL, 'http://localhost:5173']);

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.has(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

// server.use(cors(corsOptions));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(
  '/api/images',
  express.static(path.join(path.resolve(), 'public', 'images'))
);

// server.use((req, res, next) => {
//   lolcat.fromString(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// server.use('/api', app);

// // catch 404 and forward to error handler

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send(err.message || 'Something broke!');
  }

  next();
});

// // db_connect

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
