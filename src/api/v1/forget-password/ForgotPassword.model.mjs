import { Schema, model } from 'mongoose';

const ForgotPasswordSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
  },
  { 
    timestamps: true
  }
);

// Index for automatic cleanup of expired documents
ForgotPasswordSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

const { randomInt } = require('crypto');
ForgotPasswordSchema.statics.generateOTP = function() {
  // Generate 6-digit OTP using a cryptographically secure method
  return randomInt(100000, 1000000).toString();
};

ForgotPasswordSchema.statics.createOTPExpiry = function() {
  // Create expiry time 10 minutes from now
  return new Date(Date.now() + 10 * 60 * 1000);
};

const ForgotPassword = model('ForgotPassword', ForgotPasswordSchema);

export default ForgotPassword;
