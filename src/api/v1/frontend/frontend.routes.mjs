import { Router } from 'express';
import frontendController from './frontend.controller.mjs';
const router = Router();

router.get('/v1/frontend', frontendController.find);

export { router as FrontendRouter };
