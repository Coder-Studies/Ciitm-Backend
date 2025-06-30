import { Router } from 'express';
import ForgotPasswordController from './ForgotPassword.controller.mjs';

const forgotPasswordRouter = Router();


forgotPasswordRouter.post(
  '/v1/forgot-password',
  ForgotPasswordController.forgotPasswordRequest
);


forgotPasswordRouter.post(
  '/v1/validate/password',
  ForgotPasswordController.validatePasswordReset
);

export default forgotPasswordRouter;
