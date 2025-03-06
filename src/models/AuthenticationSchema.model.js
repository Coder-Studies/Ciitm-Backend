import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const AuthenticationSchema = new Schema(
  {
    provider_Name: {
      type: String,
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },

    picture: {
      type: String,
      default: '/api/images/Student_Avtar.webp',
      trim: true,
    },

    password: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true }
);

AuthenticationSchema.methods.Genrate_Password = function () {
  const password = Math.random().toString(36).slice(-8);
  return password;
};

AuthenticationSchema.methods.hashPassword = async function (password) {
  const hash = await bcrypt.hash(password, 15);
  return hash;
};

AuthenticationSchema.methods.hashEmail = async function (email) {
  try {
    if (email) {
      const JwtEmail = jwt.sign({ email: email }, process.env.JWT_SECRET);

      if (JwtEmail) {
        return JwtEmail;
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

AuthenticationSchema.methods.comparePassword = async function (password, hash) {
  try {
    console.log('pass', password, 'hash ', hash);

    const match = await bcrypt.compare(password, hash);
    if (!match) {
      throw new Error('Failed to Match Password');
    }
    return match;
  } catch (error) {
    throw new Error(`Error checking user role: ${error.message}`);
  }
};

AuthenticationSchema.statics.checkRole = async function (email) {
  try {
    const user = await this.findOne({ email: email });
    if (!user) {
      throw new Error('User not found');
    }
    return user.role;
  } catch (error) {
    throw new Error(`Error checking user role: ${error.message}`);
  }
};

AuthenticationSchema.statics.DecordToken = async function (token) {
  try {
    let { email } = jwt.verify(token, process.env.JWT_SECRET);
    console.log('123', email);
    if (!email) {
      throw new Error('Unauthorized User: Missing email in token');
    }
    return email;
  } catch (error) {
    throw new Error(`Error decoding token: ${error.message}`);
  }
};

const Authentication = model('Authentication', AuthenticationSchema);

export default Authentication;
