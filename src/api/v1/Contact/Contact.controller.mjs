import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import ContactConstant from './Contact.constant.mjs';
import ContactService from './Contact.service.mjs';
import ContactUtils from './Contact.utils.mjs';
import { Create_Contact_Validator } from './Course.validator.mjs';

class Contact_Controller {
  create = async (req, res) => {
    try {
      const { cName, cEmail, cNumber, cMessage, cCountry } = req.body;

      const { error } = Create_Contact_Validator.validate(req.body);

      if (error) {
        throw new Error(error.details[0].message);
      }

      const createdForm = await ContactService.createContact({
        cName,
        cEmail,
        cCountry,
        cNumber,
        cMessage,
      });

      SendResponse.success(res, 200, ContactConstant.CREATED, createdForm);
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  get_FormData = async (req, res) => {
    try {
      let { perPage, limit } = req.query;

      let Find_Contact = await ContactUtils.FIND_ALL_CONTACT({
        perPage: parseInt(perPage),
        limit: parseInt(limit),
      });

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        ContactConstant.FOUND,
        Find_Contact
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };

  delete_FormData = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error(ContactConstant.NOT_FOUND);
      }

      const deletedForm = await ContactService.deleteContact(id);

      if (!deletedForm) {
        throw new Error(ContactConstant.NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        ContactConstant.DELETED,
        deletedForm
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  };
}

export default new Contact_Controller();
