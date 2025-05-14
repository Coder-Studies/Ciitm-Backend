import { createTransport } from '../../utils/SendMail.js';
import dotenv from 'dotenv';
dotenv.config();

const Payment_Confirmation_Template = async ({
  studentName,
  studentId,
  paymentId,
  totalAmountDue,
  amountPaid,
  email,
}) => {
  let sendMail = await createTransport().sendMail({
    from: `"MERN Coding School" <${process.env.GMAIL_User}>`,
    to: `${studentName} <${email}>`,
    subject: 'Payment Confirmation - MERN Coding School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="http://res.cloudinary.com/dpnc8ddpf/image/upload/v1733037028/japasey8rxmxes20zkrm.jpg" alt="School Logo" style="width: 100px; height: 100px; border-radius: 50%;">
          <h2 style="color: #333; margin-top: 10px;">Payment Confirmation</h2>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <p style="color: #666; font-size: 16px; margin-bottom: 15px;">Dear ${studentName},</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 15px;">We are pleased to confirm that we have received your payment. Here are the details of your transaction:</p>
        </div>

        <div style="margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Payment ID:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Student ID:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${studentId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Total Amount Due:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">₹${totalAmountDue}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Amount Paid:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">₹${amountPaid}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="color: #333; font-size: 14px; margin: 0;">Please keep this email for your records. If you have any questions about your payment, please contact our support team.</p>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>Thank you for choosing MERN Coding School!</p>
          <p>Best regards,<br>MERN Coding School Team</p>
        </div>
      </div>
    `,
  });

  return sendMail;
};

export default Payment_Confirmation_Template;
