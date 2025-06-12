
import SendResponse from "../../../utils/SendResponse.mjs";
import StudentConstant from "../Student/Student.constant.mjs";
import StudentUtils from "../Student/Student.utils.mjs";
import { Payment_Constant } from "./fee.constant.mjs";

const FeeController = {

   
Get_Fee_Info: async (req, res) => {
  try {
    let Student_Id = req.query.uniqueId;

    if (!Student_Id) {
      throw {
        status: 403,
        message: Payment_Constant.STUDENT_ID_NOT_FOUND,
      };
    }

    let Student_Info = await StudentUtils.FindByStudentId({
      uniqueId: Student_Id,
    });


    if (!Student_Info) {
      throw {
        status: 404,
        message: Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO,
      };
    }
   
   
    SendResponse(res, {
      message: Payment_Constant.FETCH_PAYMENT_INFO,
      data: Student_Info,
      success: true,
    });


  } catch (error) {
   SendResponse.error(res, {
      message: error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO,
      status: error.status || 500,
    });
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
