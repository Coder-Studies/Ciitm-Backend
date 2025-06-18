import { Router } from 'express';
import courseController from './course.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
const router = Router();

router.post('/v1/admin/course/create', AuthMiddleware.Admin ,courseController.createCourse);

export { router as CourseRouter };
