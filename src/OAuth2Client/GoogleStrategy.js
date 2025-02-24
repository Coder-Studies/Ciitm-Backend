import { google } from 'googleapis';
import Authentication from '../models/AuthenticationSchema.model.js';
import Admin_Role from '../models/Admin_Role.model.js';

let HandleGoogle_Login = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    let Authentication_Instance = new Authentication();

    const oauth2Client = new google.auth.OAuth2();
    await oauth2Client.setCredentials({ access_token: token });

    const oauth2 = await google.oauth2({ version: 'v2', auth: oauth2Client });
    const userRes = await oauth2.userinfo.get();

    let find_User = await Authentication.findOne({ email: userRes.data.email });

    if (!find_User) {
      let find_Admin_Role = await Admin_Role.findOne({
        email: userRes.data.email,
      });

      if (!find_Admin_Role) {
        res
          .status(401)
          .json({ message: 'Failed to Sign Up You are not Verified Admin' });
      }

      let Create_Admin = await Authentication.create({
        email: userRes.data.email,
        name: userRes.data.name,
        picture: userRes.data.picture,
        email_verified: userRes.data.verified_email,
        role: 'admin',
      });

      if (!Create_Admin) {
        return res.status(400).json({ message: 'Failed to create Admin' });
      }
    }

    let hashEmail = await Authentication_Instance.hashEmail(userRes.data.email);
    res.cookie('token', hashEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Login Success', user: find_User , token: hashEmail });
  } catch (error) {
    console.error('Error verifying token:', error);
    res
      .status(500)
      .json({ message: 'Error during Google login', error: error.message });
  }
};

export default HandleGoogle_Login;
