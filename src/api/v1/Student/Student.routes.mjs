import { Router } from 'express';
import { 
  getStudents,
  getCourses,
  getSemesters,
  getStudentById 
} from './Student.controller.mjs';  // Fixed capitalization
import { HTTP_STATUS } from './Student.constant.mjs';  // Fixed capitalization

const router = Router();

/**
 * @route GET /api/v1/student/students
 * @desc Get students by course and semester
 */
router.get('/students', getStudents);

/**
 * Health check route
 */
router.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Student module is working properly',
    timestamp: new Date().toISOString(),
    module: 'student',
    version: '1.0.0'
  });
});

export default router;