import express from 'express';
const { request, response, next } = express;

import Authentication from '../api/v1/Auth/Auth.model.mjs';

class Auth_Middleware {
  Admin = async (req = request, res = response, next = next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(403).json({
          message: 'Bad Request: Token Not Found',
          admin: false,
          Unauthorized: true,
          error: true,
        });
      }

      let email = await Authentication.DecordToken(token);

      if (!email) {
        return res.status(403).json({
          message: 'Bad Request: Email Not Found',
          admin: false,
          Unauthorized: true,
          error: true,
        });
      }

      const findRole = await Authentication.checkRole(email);

      if (findRole !== 'admin') {
        return res.status(403).json({
          message: 'Bad Request: You are Not Verified Admin',
          Unauthorized: true,
          admin: false,
          error: true,
        });
      }

      return next();
    } catch (error) {
      return res.status(error.status || 401).json({
        message: error.message || 'Unauthorized User',
        admin: false,
        Unauthorized: true,
        error: true,
      });
    }
  };
}

export default new Auth_Middleware();
