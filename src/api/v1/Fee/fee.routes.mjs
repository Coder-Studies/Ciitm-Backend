import { Router } from 'express';
import FeeController from './fee.controller.mjs';
const router = Router();

router.get('/v1/Student/FeeInfo', FeeController.Get_Fee_Info);
router.patch('/v1/Student/FeeUpdate', FeeController.Update_Fee);
router.get('/v1/Student/FeeInfoByStudent', FeeController.get_fee_InfoByStudents);
router.get('/v1/Student/getEarning', FeeController.get_Earnings);

export { router as Fee_Routes };
// /api/find/student/payment/info?uniqueId=${Student_Id}