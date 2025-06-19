import { Router } from 'express';
import StudentController from './Student.controller.mjs';
const router = Router();



router.get('/find/StudentBy', StudentController.FindByCourseAndSemester)

export { router as StudentRouter };
