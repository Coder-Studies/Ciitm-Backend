import { Router } from 'express';
import TestimonialController from './Testimonial.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
const routes = Router();

routes.get(
  '/v1/findAllTestimonials',
  TestimonialController.Find_Testimonial_Controller
);
routes.post(
  '/v1/createTestimonial',
  upload.single('image'),
  TestimonialController.Create_Testimonial_Controller
);
routes.delete(
  '/v1/deleteTestimonial/:id',
  TestimonialController.Delete_Testimonial_Controller
);

export { routes as TestimonialRouter };
