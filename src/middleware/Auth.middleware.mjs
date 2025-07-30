import express from 'express';
const { request, response } = express;
import Authentication from '../api/v1/Auth/Auth.model.mjs';
import SendResponse from '../utils/SendResponse.mjs';
import StatusCodeConstant from '../constant/StatusCode.constant.mjs';
import AuthUtils from '../api/v1/Auth/Auth.utils.mjs';

class Auth_Middleware {
  Admin = async (req = request, res = response, next) => {
    try {
      const token = req.cookies?.token || req.headers['authorization'];
      console.log('Token:', token);

      if (!token) {
        throw new Error('Token is missing');
      }

      let email = await AuthUtils.DecodeToken(token);

      if (!email) {
       throw new Error('Invalid token: Missing email in payload');
      }

      const findRole = await Authentication.checkRole(email);

      if (findRole !== 'admin') {
       throw new Error('Unauthorized: Admin access required');
      }

      next();
    } catch (error) {
      console.error('Error in Admin Middleware:', error);
      SendResponse.error(res, StatusCodeConstant.UNAUTHORIZED , error.message)
    }
  };
}

export default new Auth_Middleware();
