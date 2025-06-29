import AuthenticationSchema from '../Auth/Auth.model.mjs';
import ForgotPassword from './ForgotPassword.model.mjs';
import ForgotPasswordConstant from './ForgotPassword.constant.mjs';
import { createTransport } from '../../../utils/SendMail.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ForgotPasswordService {
  async initiatePasswordReset(email) {
    // Check if user exists
    const user = await AuthenticationSchema.findOne({ email: email });
    if (!user) {
      // To prevent user enumeration, we return a success message even if the user doesn't exist.
      // The email will simply not be sent, and the process stops here silently.
      return {
        success: true,
        message: ForgotPasswordConstant.OTP_SENT_SUCCESS
      };
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
  }

  async sendOTPEmail(email, userName, otp) {
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
  }

  async validateOTPAndResetPassword(email, otp, newPassword) {
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
  }

  getForgotPasswordTemplate(email, userName, otp) {
    // Construct path to the HTML template file
    const templatePath = path.join(__dirname, '../../../template/email/forgotPassword.html');
    
    // Read the HTML template file
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with actual values
    const processedTemplate = htmlTemplate
      .replace(/{{userName}}/g, userName)
      .replace(/{{email}}/g, email)
      .replace(/{{otp}}/g, otp);
    
    return processedTemplate;
  }
}

export default new ForgotPasswordService();
