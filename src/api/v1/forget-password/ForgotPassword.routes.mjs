import { Router } from 'express';
import ForgotPasswordController from './ForgotPassword.controller.mjs';

const forgotPasswordRouter = Router();

/**
 * GET /v1/forgot-password/:email
 * Initiates the forgot password process for a given email address
 */
forgotPasswordRouter.get(
  '/forgot-password/:email',
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
