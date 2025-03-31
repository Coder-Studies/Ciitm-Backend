import Authentication_Schema from '../api/v1/Auth/Auth.model.mjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({
  path: '../../.env',
});

export const Decord_Cookie = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let findUser = await Authentication_Schema.findOne({
      email: decoded.email,
    });

    if (!findUser) {
      return Error('Unauthorized');
    }

    return findUser;
  } catch (error) {
    return Error(error.message || 'Unauthorized');
  }
};
