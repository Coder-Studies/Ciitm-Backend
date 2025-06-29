import { Router } from 'express';
import ForgotPasswordController from './ForgotPassword.controller.mjs';

const forgotPasswordRouter = Router();

/**
 * POST /v1/forgot-password
 * Initiates the forgot password process for a given email address
 */
forgotPasswordRouter.post(
  '/forgot-password',
  ForgotPasswordController.forgotPasswordRequest
);

/**
 * POST /v1/validate/password
 * Validates OTP and resets the user's password
 */
forgotPasswordRouter.post(
  '/validate/password',
  ForgotPasswordController.validatePasswordReset
);

export default forgotPasswordRouter;
