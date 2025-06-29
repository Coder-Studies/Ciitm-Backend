import { request, response } from 'express';
import SendResponse from '../../../utils/SendResponse.mjs';
import ForgotPasswordService from './ForgotPassword.service.mjs';
import ForgotPasswordConstant from './ForgotPassword.constant.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import {
  ForgotPasswordRequestValidator,
  ValidatePasswordResetValidator
} from './ForgotPassword.validator.mjs';

class ForgotPasswordController {
  /**
   * Initiates forgot password process
   * Endpoint: GET /api/v1/forgot-password/:email
   */
  async forgotPasswordRequest(req = request, res = response) {
    try {
      const { email } = req.params;

      // Validate email using Joi validator
      const { error } = ForgotPasswordRequestValidator.validate({ email });
      if (error) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          error.details[0].message
        );
      }

      const result = await ForgotPasswordService.initiatePasswordReset(email);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        result.message,
        { email: email }
      );
    } catch (error) {
      console.error('Forgot Password Request Error:', error);
      
      // Check if it's a known error message
      const isKnownError = Object.values(ForgotPasswordConstant).includes(error.message);
      const statusCode = isKnownError ? StatusCodeConstant.BAD_REQUEST : StatusCodeConstant.INTERNAL_SERVER_ERROR;
      
      SendResponse.error(
        res,
        statusCode,
        error.message || 'Error processing forgot password request'
      );
    }
  }

  /**
   * Validates OTP and resets password
   * Endpoint: POST /api/v1/validate/password
   */
  async validatePasswordReset(req = request, res = response) {
    try {
      const { email, otp, newPassword } = req.body;

      // Validate request body using Joi validator
      const { error } = ValidatePasswordResetValidator.validate({
        email,
        otp,
        newPassword
      });
      
      if (error) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          error.details[0].message
        );
      }

      const result = await ForgotPasswordService.validateOTPAndResetPassword(
        email,
        otp,
        newPassword
      );

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        result.message,
        { email: email }
      );
    } catch (error) {
      console.error('Validate Password Reset Error:', error);
      
      // Check if it's a known error message
      const isKnownError = Object.values(ForgotPasswordConstant).includes(error.message);
      const statusCode = isKnownError ? StatusCodeConstant.BAD_REQUEST : StatusCodeConstant.INTERNAL_SERVER_ERROR;
      
      SendResponse.error(
        res,
        statusCode,
        error.message || 'Error validating password reset'
      );
    }
  }
}

export default new ForgotPasswordController();
