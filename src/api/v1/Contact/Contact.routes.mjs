import { Router } from 'express';
const router = Router();
import ContactController from './Contact.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

router.post('/v1/contact/create', ContactController.create);

router.get(
  '/v1/contact/admin/getContact',
  AuthMiddleware.Admin,
  ContactController.get_FormData
);

router.delete(
  '/v1/contact/admin/deleteContact/:id',
  AuthMiddleware.Admin,
  ContactController.delete_FormData
);

export { router as ContactRouter };
