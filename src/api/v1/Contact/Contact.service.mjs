import Contact from './Contace.model.mjs';

class Contact_Service {
  createContact = async (data) => {
    try {
      const createdForm = await Contact.create(data);
      if (!createdForm) {
        throw new Error(ContactConstant.NOT_CREATED);
      }
      return createdForm;
    } catch (error) {
      throw new Error(error.message || ContactConstant.NOT_CREATED);
    }
  };

  deleteContact = async (id) => {
    try {
      const deletedForm = await Contact.findByIdAndDelete(id);
      if (!deletedForm) {
        throw new Error(ContactConstant.NOT_FOUND);
      }
      return deletedForm;
    } catch (error) {
      throw new Error(error.message || ContactConstant.NOT_FOUND);
    }
  };
}

export default new Contact_Service();
