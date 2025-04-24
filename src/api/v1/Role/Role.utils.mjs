import RoleConstant from './Role.constant.mjs';
import Admin_Role from './Role.model.mjs';

class Role_Utils {
  Find_Role = async (email) => {
    try {
      let Role_Found = await Admin_Role.findOne({ email: email });

      if (Role_Found) {
        throw new Error(RoleConstant.ROLE_ALREADY_EXISTS);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to find Role');
    }
  };
}

export default new Role_Utils();
