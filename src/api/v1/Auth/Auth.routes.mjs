import { Router } from 'express';
const router = Router();
import AuthController from './Auth.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

router.post('/v1/auth/login', AuthController.Login);

router.post('/v1/auth/Admin/SignUp', AuthMiddleware.Admin ,AuthController.SignUP_Admin);

export { router as AuthRouter };
