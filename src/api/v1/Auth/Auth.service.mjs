import AuthenticationSchema from './Auth.model.mjs';
import AuthConstant from './Auth.constant.mjs';

class AuthService {
  async CreateUser({ name, email, password, role }) {
    try {
      let Authentication_Instance = new AuthenticationSchema();
      let HashPassword = await Authentication_Instance.hashPassword(password);
      let HashEmail = await Authentication_Instance.hashEmail(email);

      if (!HashEmail && !HashPassword) {
        throw new Error(AuthConstant.HASH_FAILED);
      }

      let CreatedUser = await AuthenticationSchema.create({
        provider_Name: name,
        name: name,
        email: email,
        email_verified: true,
        password: HashPassword,
        role: role,
      });

      if (!CreatedUser) {
        throw new Error(AuthConstant.USER_NOT_CREATED);
      }

      return { CreatedUser, HashEmail };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new AuthService();
