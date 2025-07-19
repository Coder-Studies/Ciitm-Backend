import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusConstant from '../Status/Status.constant.mjs';
import StudentConstant from '../Student/Student.constant.mjs';
import StudentUtils from '../Student/Student.utils.mjs';
import { Payment_Constant } from './fee.constant.mjs';
import feeService from './fee.service.mjs';
import feeUtils from './fee.utils.mjs';
import { UpdateFee_Validator } from './fee.validator.mjs';

const FeeController = {
  Get_Fee_Info: async (req, res) => {
    try {
      let uniqueId = req.query.uniqueId;
      console.log('Request Query:', req.query.uniqueId);

      console.log('Student Info:', uniqueId);

      if (!uniqueId) {
        throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND);
      }

      let Student_Info = await feeUtils.Find_Fee_By_StudentId(uniqueId);


      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.FETCH_PAYMENT_INFO_SUCCESS,
        {
          Student_Info: Student_Info,
        }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },


  get_fee_InfoByStudents : async (req, res) => {
    try {
      let { uniqueId } = req.query;
       
      console.log('Request Query:', req.query.uniqueId);

      if (!uniqueId) {
        throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND);
      }
      let Student_Info = await StudentUtils.FindByStudentId(uniqueId);

      if (!Student_Info) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        StudentConstant.STUDENT_FOUND,
        Student_Info
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },  

  // Create_Fee: async (req, res) => {
  //   // Implementation for creating fee
  // },

  Update_Fee: async (req, res) => {
    try {
      let { uniqueId, paymentMethod, Paid_amount } = req.body;
      console.log('Request Body:', req.body);

      let { fee, _id } = await feeUtils.TOTAL_FEE_PAID_BY_UNIQUE_ID(uniqueId);

      if (!fee || !_id) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }

      let { error } = UpdateFee_Validator.validate({
        uniqueId,
        Student_id: String(_id),
        paymentMethod,
        Paid_amount,
        totalFee: fee.course_Fee,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      let Update_Fee = await feeService.Update_Student_fee({
        totalFee: fee.course_Fee,
        ...req.body,
      });
     
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.PAYMENT_PAID,
        Update_Fee
      );
    } catch (error) {
      console.log('Error in Update_Fee:', error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  },
  // Delete_Fee: async (req, res) => {
  //   // Implementation for deleting fee
  // },
};

export default FeeController;
