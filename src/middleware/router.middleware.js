import express from 'express';
const app = express();

import { AdminVerify, StudentVerify } from './Login_middleware.js';

import indexRouter from '../routes/index.mjs';
import adminRouter from '../routes/admin.js';

app.use('/api', indexRouter);
app.use('/api/admin', AdminVerify, adminRouter);

export default app;
