import Razorpay from 'razorpay';
import { Payment_Constant } from '../constant/Payment.constant.js';
import { get_Payment_info } from '../Service/student.service.js';

export const Find_Student_Payment_Info = async (req, res) => {
  try {
    let Student_Id = req.query.uniqueId;




    if (!Student_Id) {
      throw {
        status: 403,
        message: Payment_Constant.UNIQE_ID_NOT_FOUND,
      };
    }

   let Student_Info =  await get_Payment_info({ uniqueId: Student_Id });
   console.log('Student Info:- ', Student_Info);
    return res.status(200).json({
      data: Student_Info,
    });

  
  } catch (error) {
    return res.status(error.status || 403).json({
      message: error.message || Payment_Constant.FAIL_TO_Info,
      error: true,
    });
  }
};

// This Controller Allow Student and Parrent to Pay Student Fee
export const Handle_StudentFee_Paid = (req, res) => {
  try {
    let { amount } = req.body;

    var instance = new Razorpay({
      key_id: process.env.Razorpay_key,
      key_secret: process.env.Razorpay_secret,
    });

    var options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
      notes: {
        purpose: 'Student Fee Payment',
      },
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      res.status(201).json({
        message: 'Payment Created',
        order,
        created: true,
      });
    });
  } catch (error) {
    return res.status(error.status || 403).json({
      message: error.message || Payment_Constant.FAIL_TO_PAY,
      error: true,
    });
  }
};
