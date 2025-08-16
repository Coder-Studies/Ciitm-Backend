import { Router } from 'express';
import TeacherController from './Teacher.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';
import { validateTeacherId, validateUpdateData } from '../../../middleware/validation.mjs';

const router = Router();

router.post(
  '/v1/admin/teacher/create',
  AuthMiddleware.Admin,
  TeacherController.createNewTeacher
);

router.get('/v1/user/findAllTeachers', TeacherController.FindAllTeachers);

// New routes for update and delete
router.put(
  '/v1/admin/teacher/:id', 
  AuthMiddleware.Admin,
  validateTeacherId, 
  validateUpdateData, 
  TeacherController.updateTeacher
);

router.delete(
  '/v1/admin/teacher/:id', 
  AuthMiddleware.Admin,
  validateTeacherId, 
  TeacherController.deleteTeacher
);

export { router as TeacherRouter };