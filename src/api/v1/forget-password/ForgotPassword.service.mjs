import AuthenticationSchema from '../Auth/Auth.model.mjs';
import ForgotPassword from './ForgotPassword.model.mjs';
import ForgotPasswordConstant from './ForgotPassword.constant.mjs';
import { createTransport } from '../../../utils/SendMail.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

class ForgotPasswordService {
  async initiatePasswordReset(email) {
    try {
      // Check if user exists
      const user = await AuthenticationSchema.findOne({ email: email });
      if (!user) {
        throw new Error(ForgotPasswordConstant.USER_NOT_FOUND);
      }

      // Generate OTP
      const otp = ForgotPassword.generateOTP();
      const otpExpiry = ForgotPassword.createOTPExpiry();

      // Hash the OTP before storing
      const hashedOTP = await bcrypt.hash(otp, 12);

      // Store or update OTP record
      await ForgotPassword.findOneAndUpdate(
        { email: email },
        { 
          otp: hashedOTP, 
          otpExpiry: otpExpiry 
        },
        { 
          upsert: true, 
          new: true 
        }
      );

      // Send email with OTP
      await this.sendOTPEmail(email, user.name, otp);

      return {
        success: true,
        message: ForgotPasswordConstant.OTP_SENT_SUCCESS
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendOTPEmail(email, userName, otp) {
    try {
      const transporter = createTransport();
      
      // Get the HTML template
      const htmlTemplate = this.getForgotPasswordTemplate(email, userName, otp);

      const mailOptions = {
        from: `"MERN Coding School" <${process.env.GMAIL_User}>`,
        to: email,
        subject: 'Password Reset OTP - MERN Coding School',
        html: htmlTemplate
      };

      const info = await transporter.sendMail(mailOptions);
      
      if (!info.messageId) {
        throw new Error(ForgotPasswordConstant.EMAIL_SEND_FAILED);
      }

      return info;
    } catch (error) {
      throw new Error(`${ForgotPasswordConstant.EMAIL_SEND_FAILED}: ${error.message}`);
    }
  }

  async validateOTPAndResetPassword(email, otp, newPassword) {
    try {
      // Check if user exists
      const user = await AuthenticationSchema.findOne({ email: email });
      if (!user) {
        throw new Error(ForgotPasswordConstant.USER_NOT_FOUND);
      }

      // Find OTP record
      const otpRecord = await ForgotPassword.findOne({ email: email });
      if (!otpRecord) {
        throw new Error(ForgotPasswordConstant.OTP_INVALID);
      }

      // Check if OTP has expired
      if (new Date() > otpRecord.otpExpiry) {
        // Clean up expired OTP
        await ForgotPassword.deleteOne({ email: email });
        throw new Error(ForgotPasswordConstant.OTP_EXPIRED);
      }

      // Verify OTP
      const isOTPValid = await bcrypt.compare(otp, otpRecord.otp);
      if (!isOTPValid) {
        throw new Error(ForgotPasswordConstant.OTP_INVALID);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 15);

      // Update user password
      await AuthenticationSchema.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true }
      );

      // Clean up OTP record after successful password reset
      await ForgotPassword.deleteOne({ email: email });

      return {
        success: true,
        message: ForgotPasswordConstant.PASSWORD_RESET_SUCCESS
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getForgotPasswordTemplate(email, userName, otp) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
            <img src="http://res.cloudinary.com/dpnc8ddpf/image/upload/v1733037028/japasey8rxmxes20zkrm.jpg" alt="MERN Coding School Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #ffffff; margin-bottom: 15px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Password Reset Request</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">Hello ${userName},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              We received a request to reset the password for your account associated with the email address:
            </p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 0 0 25px 0; text-align: center;">
              <strong style="color: #1f2937; font-size: 16px;">${email}</strong>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Use the following One-Time Password (OTP) to reset your password. This OTP is valid for <strong>10 minutes</strong> only:
            </p>
            
            <!-- OTP Box -->
            <div style="background-color: #2563eb; color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; margin: 0 0 30px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${otp}</div>
              <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Your OTP Code</div>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 0 0 25px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                ⚠️ <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
              Best regards,<br>
              <strong>MERN Coding School Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
              This email was sent to ${email}. If you have any questions, please contact our support team.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0; text-align: center;">
              © 2024 MERN Coding School. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new ForgotPasswordService();
