import EmailUtils from './Email.utils.mjs';
import { Review_Validator } from './Email.validator.mjs';

class Email_Service {
  sendReviewMail = async ({ recipientEmail, name, uniqueId }) => {
    try {
      let { error } = Review_Validator.validate({
        recipientEmail,
        name,
        uniqueId,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      await EmailUtils.sendReviewMail({
        recipientEmail,
        name,
        uniqueId,
      });
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default new Email_Service();
