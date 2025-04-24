import Contact from './Contace.model.mjs';
import ContactConstant from './Contact.constant.mjs';

class Contact_Utils {


  FIND_ALL_CONTACT = async ({ perPage, limit }) => {
    try {
      const contactData = await Contact.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((perPage - 1) * limit);

      if (contactData.length === 0) {
        throw new Error(ContactConstant.NOT_FOUND);
      }

      return contactData;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  };
}


export default new Contact_Utils();