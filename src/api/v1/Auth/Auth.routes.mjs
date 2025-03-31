import { Router } from 'express';
import AuthController from './Auth.controller.mjs';
const router = Router();

router.post('/v1/auth/login', AuthController.Login);

router.post('/v1/auth/Admin/SignUp', AuthController.SignUP_Admin);

export { router as AuthRouter };
