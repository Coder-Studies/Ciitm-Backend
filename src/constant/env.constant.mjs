import { configDotenv } from 'dotenv';

configDotenv();

const env_Constant = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  GMAIL_User: process.env.GMAIL_User,
  GMAIL_Password: process.env.GMAIL_Password,
};

export default Object.freeze(env_Constant);
