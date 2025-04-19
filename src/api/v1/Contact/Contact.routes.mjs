import { Router } from 'express';
const router = Router();
import ContactController from './Contact.controller.mjs';


router.post('/v1/contact/create', ContactController.create);

export { router as ContactRouter };
