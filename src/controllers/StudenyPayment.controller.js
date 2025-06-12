import Razorpay from 'razorpay';
import { Payment_Constant } from '../constant/Payment.constant.js';
import {
  Create_Payment_Record,
  get_Payment_info,
} from '../Service/student.service.js';



let instance = new Razorpay({
  key_id: process.env.Razorpay_key,
  key_secret: process.env.Razorpay_secret,
});

export const Create_Order = (req, res) => {
  try {
    let { amount } = req.body;

    let options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'order_' + Math.floor(Math.random() * 1000),
      payment_capture: '1',
      notes: {
        purpose: 'Student Fee Payment',
      },
    };

    instance.orders.create(options, function (err, order) {
      if (err) {
        throw {
          status: 403,
          message: Payment_Constant.FAIL_TO_PAY,
        };
      }
      res.status(201).json({
        message: 'Payment Created',
        order,
        created: true,
      });
    });
  } catch (error) {
    console.log('Error:- ', error);
    return res.status(error.status || 403).json({
      message: error.message || Payment_Constant.FAIL_TO_PAY,
      error: true,
    });
  }
};

export const Verify_Payment = async (req, res) => {
  try {
    const { payment_id, Unique_id, course_Fee } = req.body;

    console.log('Payment ID body:- ', req.body);

    if (!payment_id) {
      return res.status(400).json({
        message: 'Payment ID is required',
        error: true,
      });
    }

    const Fetch_Payment = await instance.payments.fetch(payment_id);

    if (!Fetch_Payment || Fetch_Payment.status !== 'authorized') {
      return res.status(400).json({
        message: 'Payment verification failed or payment not captured',
        error: true,
      });
    }

    let Create_Pay_Record = await Create_Payment_Record({
      Unique_id: Unique_id,
      course_Fee: course_Fee,
      payment_id: payment_id,
      amount_paid: Fetch_Payment.amount / 100,
    });

    return res.status(200).json({
      message: 'Payment Successful',
      data: Create_Pay_Record,
    });
  } catch (error) {
    console.error('Error 3:- ', error);
    return res.status(500).json({
      message: error.message || 'Failed to verify payment',
      error: true,
    });
  }
};
