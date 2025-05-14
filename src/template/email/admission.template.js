import { createTransport } from '../../utils/SendMail.js';
import dotenv from 'dotenv';
dotenv.config();

const Admission_Confirmation_Template = async ({
  studentName,
  studentId,
  email,
  password,
}) => {
  let sendMail = await createTransport().sendMail({
    from: `"MERN Coding School" <${process.env.GMAIL_User}>`,
    to: `${studentName} <${email}>`,
    subject: 'Welcome to MERN Coding School - Your Login Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="http://res.cloudinary.com/dpnc8ddpf/image/upload/v1733037028/japasey8rxmxes20zkrm.jpg" alt="School Logo" style="width: 100px; height: 100px; border-radius: 50%;">
          <h2 style="color: #333; margin-top: 10px;">Welcome to MERN Coding School!</h2>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <p style="color: #666; font-size: 16px; margin-bottom: 15px;">Dear ${studentName},</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 15px;">Congratulations on your successful admission to MERN Coding School! We are excited to have you join our community.</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Your Login Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Student ID:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${studentId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Email Address:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Temporary Password:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${password}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h4 style="color: #333; margin-top: 0;">Important Security Notice:</h4>
          <p style="color: #333; font-size: 14px; margin: 0;">For your security, please change your password immediately after your first login. Keep your login credentials confidential and do not share them with anyone.</p>
        </div>

        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h4 style="color: #333; margin-top: 0;">Next Steps:</h4>
          <ol style="color: #333; font-size: 14px; margin: 0; padding-left: 20px;">
            <li>Log in to your account using the credentials provided above</li>
            <li>Change your password immediately</li>
            <li>Complete your profile information</li>
            <li>Review your course schedule and materials</li>
          </ol>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Welcome aboard!<br>MERN Coding School Team</p>
        </div>
      </div>
    `,
  });

  return sendMail;
};

export default Admission_Confirmation_Template;
