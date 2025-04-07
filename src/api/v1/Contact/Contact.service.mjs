import ContactConstant from './Contact.constant.mjs';

class Contact_Service {
  createContact = async (data) => {
    try {
      const createdForm = await contactSchema.create(data);
      if (!createdForm) {
        throw new Error(ContactConstant.NOT_CREATED);
      }
      return createdForm;
    } catch (error) {
      throw new Error(error.message || ContactConstant.NOT_CREATED);
    }
  };
}

export default new Contact_Service();
