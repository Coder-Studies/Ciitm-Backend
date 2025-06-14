import { Router } from 'express';
const router = Router();
import { StudentController } from './Student.controller.mjs';

router.get('/student', StudentController.Get_Student_Info);

export { router as StudentRouter };
