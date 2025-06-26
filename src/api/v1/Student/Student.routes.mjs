import { Router } from 'express';
import StudentController from './Student.controller.mjs';
const router = Router();



router.get('/v1/Student/FindByCourseAndSemester', StudentController.FindByCourseAndSemester)

export { router as StudentRouter };
