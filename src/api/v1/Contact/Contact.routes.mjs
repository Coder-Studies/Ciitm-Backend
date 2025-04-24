import { Router } from 'express';
const router = Router();
import ContactController from './Contact.controller.mjs';

router.post('/v1/contact/create', ContactController.create);

router.get('/v1/contact/admin/getContact', ContactController.get_FormData);

export { router as ContactRouter };
