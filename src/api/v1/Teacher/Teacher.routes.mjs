import { Router } from 'express';
import TeacherController from './Teacher.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
const router = Router();

router.post('/v1/admin/teacher/create', AuthMiddleware.Admin, TeacherController.createNewTeacher);



export { router as TeacherRouter };
