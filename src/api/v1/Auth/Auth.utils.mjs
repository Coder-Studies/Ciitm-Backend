import { SignUp_Validator } from './Auth.validator.mjs';

class AuthUtility {
  async SignUP_Validator({ name, email, password, confirm_Password }) {
    try {
      let { error } = SignUp_Validator.validate({
        name: name,
        email: email,
        password: password,
        confirm_Password: confirm_Password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new AuthUtility();
