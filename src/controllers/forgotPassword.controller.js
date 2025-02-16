import Authentication from '../models/AuthenticationSchema.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createTransport } from '../utils/SendMail.js';
import dotenv from 'dotenv';
dotenv.config();


export let ForgotPassword_Controller = async (req, res) => {
  try {
    let { email } = req.body;

    // Step 1: Find the user in the database
    let findUser = await Authentication.findOne({ email: email });

    if (!findUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Step 2: Generate a secure OTP and hash it
    let otp = crypto.randomBytes(3).toString('hex'); // Generate a 6-character OTP
    let hashedOtp = await bcrypt.hash(otp, 10);

    // Step 3: Set the OTP cookie
    res.cookie('otp', hashedOtp, { httpOnly: true, secure: true });

    // Step 4: Send the OTP to the user's email
    let transporter = createTransport();

    let mailOptions = {
      from: process.env.GMAIL_User,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error });
      } else {
        return res.status(200).json({ message: 'OTP sent to email' });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};