import EmailService from './Email.service.mjs';
import { Payment_Confirmation_Validator, Admission_Confirmation_Validator } from './Email.validator.mjs';
import EmailConstant from './Email.constant.mjs';

class Email_Controller {
  sendPaymentConfirmation = async (req, res) => {
    try {
      const { error } = Payment_Confirmation_Validator.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }

      await EmailService.sendPaymentConfirmation(req.body);

      res.status(200).json({
        success: true,
        message: EmailConstant.EMAIL_SEND,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || EmailConstant.EMAIL_NOT_SEND,
      });
    }
  };

  sendAdmissionConfirmation = async (req, res) => {
    try {
      const { error } = Admission_Confirmation_Validator.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }

      await EmailService.sendAdmissionConfirmation(req.body);

      res.status(200).json({
        success: true,
        message: EmailConstant.EMAIL_SEND,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || EmailConstant.EMAIL_NOT_SEND,
      });
    }
  };
}

export default new Email_Controller();
