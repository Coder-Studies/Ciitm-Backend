import { configDotenv } from 'dotenv';

configDotenv();

const env_Constant = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  GMAIL_User: process.env.GMAIL_User,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
  GMAIL_Password: process.env.GMAIL_Password,
  isDevelopment: process.env.isDevelopment,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

export default Object.freeze(env_Constant);
