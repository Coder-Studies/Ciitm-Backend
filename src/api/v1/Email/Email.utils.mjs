
import envConstant from '../../../constant/env.constant.mjs';
import { createTransport } from '../../../utils/SendMail.js';


class Email_Utils {




    
  sendReviewMail = async (data) => {
    try {
      let { recipientEmail, name, uniqueId } = data;


      const jsx = await compile(mdxSource);



 


      let MailSend_toUser = await createTransport().sendMail({
        from: `"MERN Coding School"  ${envConstant.GMAIL_User}>`,
        to: `${recipientEmail}`,
        subject: 'Admission Review',
        // html: // Render the Review content Here Review.jsx,
      });

      if (!MailSend_toUser) {
        throw new Error(EmailConstant.EMAIL_NOT_SEND);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default new Email_Utils();
