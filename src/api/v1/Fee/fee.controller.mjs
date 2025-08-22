import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import crypto from 'crypto';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusConstant from '../Status/Status.constant.mjs';
import StudentConstant from '../Student/Student.constant.mjs';
import StudentUtils from '../Student/Student.utils.mjs';
import { Payment_Constant } from './fee.constant.mjs';
import feeService from './fee.service.mjs';
import feeUtils from './fee.utils.mjs';
import { UpdateFee_Validator } from './fee.validator.mjs';
import cf from '../../../utils/cashfree.mjs';
import Fee from './fee.model.mjs';

const FeeController = {
  // ✅ Get student fee info by unique ID
  Get_Fee_Info: async (req, res) => {
    try {
      const uniqueId = req.query.uniqueId;
      if (!uniqueId) throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND);

      const Student_Info = await feeUtils.Find_Fee_By_StudentId(uniqueId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.FETCH_PAYMENT_INFO_SUCCESS,
        { Student_Info }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },

  pay_Online: async (req, res) => {
    try {
      const {
        order_amount,
        customer_id,
        customer_name,
        customer_phone,
        customer_email,
        uniqueId,
        PaymentType,
        discount = 0
      } = req.body;


    

   
      if (
        !order_amount ||
        !customer_phone ||
        !customer_email ||
        !uniqueId ||
        !PaymentType
      ) {
        throw new Error(
          'Please provide all required fields: order_amount, customer_phone, customer_email, uniqueId, PaymentType.'
        );
      }

      const { fee, _id } = await feeUtils.TOTAL_FEE_PAID_BY_UNIQUE_ID(uniqueId);

      const order_id = 'ORDER_' + crypto.randomBytes(2).toString('hex');
      const orderRequest = {
        order_id,
        order_amount: parseFloat(order_amount),
        order_currency: 'INR',
        customer_details: {
          customer_id,
          customer_name,
          customer_phone: customer_phone.toString(),
          customer_email,
        },
      };

      const response = await cf.PGCreateOrder(orderRequest);
 
      console.log('Cashfree order creation response:', response.data);
      if(!response.data.order_id){
        throw new Error('Failed to create payment order.');
      }


      const paymentStatus =
        response.data.order_status === 'PAID' ? 'Completed' : 'Pending';


       
      
      const feeRecord = await feeService.Update_Student_fee({
        uniqueId,
        Paid_amount: parseFloat(order_amount),
        totalFee: fee.course_Fee,
        PaymentType,
        paymentId: order_id,
        status: paymentStatus,
      })

      const hashString = `${response.data.order_id}${response.data.order_amount}${process.env.CASHFREE_CLIENT_SECRET}`;
      const hash_Response = crypto.createHash('sha256').update(hashString).digest('hex');

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.ORDER_CREATED_SUCCESSFULLY,
        {
          payment_session_id: response.data.payment_session_id,
          order_id: response.data.order_id,
          hash: hash_Response,
          cashfree_response: response.data,
          fee: feeRecord,
        }
      );
    } catch (error) {
      console.error(
        'Cashfree order creation error:',
        error?.response?.data || error.message || error
      );
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error?.response?.data?.message || 'Failed to create payment order.'
      );
    }
  },

  // ✅ Get student info by student ID
  get_fee_InfoByStudents: async (req, res) => {
    try {
      const { uniqueId } = req.query;

      if (!uniqueId) {
        throw new Error(Payment_Constant.UNIQE_ID_NOT_FOUND);
      }

      const Student_Info = await StudentUtils.FindByStudentId(uniqueId);

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

  // ✅ Get student's bill info by payment ID
  get_StudentBillByPaymentId: async (req, res) => {
    try {
      const PaymentId = req.query.paymentId;

      if (!PaymentId) {
        throw new Error('Please provide Payment ID');
      }

      const getBillInfo =
        await feeService.get_StudentBillByPaymentId(PaymentId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.FETCH_PAYMENT_INFO,
        getBillInfo
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_PAYMENT_INFO
      );
    }
  },

  // ✅ Get earnings in a date range
  get_Earnings: async (req, res) => {
    try {
      let { startDate, endDate } = req.query;

      if (!startDate) {
        throw new Error(Payment_Constant.MISSING_QUERY_PARAMS);
      }

      if (!endDate) endDate = startDate;

      if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) startDate += 'T00:00:00.000Z';
      if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) endDate += 'T23:59:59.999Z';

      const earnings = await feeUtils.Get_Earnings_By_Date_Range({
        startDate,
        endDate,
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        Payment_Constant.EARNINGS_FETCHED_SUCCESSFULLY,
        earnings
      );
    } catch (error) {
      console.error('Error in get_Earnings:', error.message, error.stack);
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || Payment_Constant.FAILED_TO_FETCH_EARNINGS
      );
    }
  },

  // ✅ Update student fee
  Update_Fee: async (req, res) => {
    try {
      const { uniqueId, paymentMethod, Paid_amount, PaymentType } = req.body;

      const { fee, _id } = await feeUtils.TOTAL_FEE_PAID_BY_UNIQUE_ID(uniqueId);

      if (!fee || !_id) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }

      const { error } = UpdateFee_Validator.validate({
        uniqueId,
        Student_id: String(_id),
        paymentMethod,
        Paid_amount,
        PaymentType,
        totalFee: fee.course_Fee,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      const Update_Fee = await feeService.Update_Student_fee({
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
      console.error('Error in Update_Fee:', error.message || error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  },

  // ✅ Verify payment status
  verify_Online_Payment: async (req, res) => {
    try {
      const { order_id } = req.body;
      if (!order_id) {
        throw new Error('Order ID is required for verification.');
      }

      const response = await cf.PGFetchOrder(order_id);

      const paymentStatus =
        response.data.order_status === 'PAID' ? 'Completed' : 'Pending';

      const updatedFee = await Fee.findOneAndUpdate(
        { PaymentId: order_id },
        { status: paymentStatus },
        { new: true }
      );

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        `Payment status is ${paymentStatus}.`,
        {
          cashfree_status: response.data.order_status,
          fee_status: paymentStatus,
          fee: updatedFee,
        }
      );
    } catch (error) {
      console.error(
        'Cashfree payment verification error:',
        error?.response?.data || error.message || error
      );
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error?.response?.data?.message || 'Failed to verify payment.'
      );
    }
  },
};

export default FeeController;
