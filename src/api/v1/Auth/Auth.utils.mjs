import jwt from 'jsonwebtoken';
import Authentication from './Auth.model.mjs';
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

  FindByEmail = async (email) => {
    return Authentication.findOne({ email: email });
  };


  DecodeToken = async function (token) {
    try {
      if (!token) {
        throw new Error('Token is missing');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.email) {
        throw new Error('Invalid token: Missing email in payload');
      }
  
      return decoded.email;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      throw new Error(`Error decoding token: ${error.message}`);
    }
  };
}

export default new AuthUtility();
