import AuthenticationSchema from '../models/AuthenticationSchema.model.js';
import Admin_Role from '../models/Admin_Role.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

export let Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    

    let Authentication_Instance = new AuthenticationSchema();

  

    let HashEmail = await Authentication_Instance.hashEmail(email);

    let Find_User = await AuthenticationSchema.findOne({ email: email });

    if (!Find_User) {
      return res.status(400).json({ message: 'User not found' });
    }


    let ComparePassword = await Authentication_Instance.comparePassword(
      password,
      Find_User.password
    );

   

    if (!ComparePassword) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    res.cookie('token', HashEmail);

    return res.status(200).json({
      message: 'Logged in successfully',
      Find_User,
      token: HashEmail,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || 'Error logging in admin', error });
  }
};
