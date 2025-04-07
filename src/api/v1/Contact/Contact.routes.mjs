import { Router } from 'express';
import ContactController from './Contact.controller.mjs';
const router = Router();

router.post('/v1/contact/create', ContactController.create);

export { router as ContactRouter };
