import { Router } from 'express';
const router = Router();

import FeeController from './fee.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

router.get('/v1/Student/FeeInfo', FeeController.Get_Fee_Info);
router.patch('/v1/Student/FeeUpdate', AuthMiddleware.Admin , FeeController.Update_Fee);
router.get('/v1/Student/FeeInfoByStudent', FeeController.get_fee_InfoByStudents);

export { router as Fee_Routes };
// /api/find/student/payment/info?uniqueId=${Student_Id}