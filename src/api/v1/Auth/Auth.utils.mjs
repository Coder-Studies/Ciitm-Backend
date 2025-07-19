import Authentication from './Auth.model.mjs';
import jwt from 'jsonwebtoken';
import env_Constant from '../../../constant/env.constant.mjs';
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

  DecodeToken = async function (token) {
  try {
    let { email } = jwt.verify(token, env_Constant.JWT_SECRET);
  
    if (!email) {
      throw new Error('Unauthorized User: Missing email in token');
    }
    return email;
  } catch (error) {
    throw new Error(`Error decoding token: ${error.message}`);
  }
};

  FindByEmail = async (email) => {
    return Authentication.findOne({ email: email });
  };
}

export default new AuthUtility();
