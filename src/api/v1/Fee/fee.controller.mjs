import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusConstant from '../Status/Status.constant.mjs';
import StudentConstant from '../Student/Student.constant.mjs';
import StudentUtils from '../Student/Student.utils.mjs';
import { Payment_Constant } from './fee.constant.mjs';

const FeeController = {
  Get_Fee_Info: async (req, res) => {
    try {
      let uniqueId = req.query.uniqueId;
      console.log('Request Query:', req.query.uniqueId);

      console.log('Student Info:', uniqueId);

      if (!uniqueId) {
        throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND)
      }

      let Student_Info = await StudentUtils.FindByStudentId(uniqueId);


      // if (!Student_Info) {
      //   throw {
      //     status: 404,
      //     message: Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO,
      //   };
      // }

      SendResponse.success(res, StatusCodeConstant.SUCCESS , Payment_Constant.FETCH_PAYMENT_INFO_SUCCESS, {
        Student_Info: Student_Info,
      });
    } catch (error) {
     SendResponse.error(res, StatusCodeConstant.BAD_REQUEST , error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO)
    }
  },

  Create_Fee: async (req, res) => {
    // Implementation for creating fee
  },
  Get_Fee: async (req, res) => {
    // Implementation for getting fee
  },
  Update_Fee: async (req, res) => {
    // Implementation for updating fee
  },
  Delete_Fee: async (req, res) => {
    // Implementation for deleting fee
  },
};

export default FeeController;
