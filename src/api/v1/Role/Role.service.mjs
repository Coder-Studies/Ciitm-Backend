import RoleConstant from './Role.constant.mjs';
import Admin_Role from './Role.model.mjs';

class Role_Service {
  create_Admin_Role = async (email) => {
    try {
      const Create_Admin = await Admin_Role.create({
        email: email,
      });

      if (!Create_Admin) {
        throw Error(RoleConstant.ROLE_NOT_CREATED);
      }

      return Create_Admin;
    } catch (error) {
      throw new Error(error.message || 'Failed to create Admin Role');
    }
  };
}
export default new Role_Service();
