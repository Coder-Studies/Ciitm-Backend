import StudentAuthentication from '../api/v1/Auth/Auth.model.mjs';
import jwt from 'jsonwebtoken';
import logger from '../middleware/loggerMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const GoogleAuth_Controller = async (req, res) => {
  try {
    const { token, user } = req.user; // Assuming req.user is populated by Passport

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if the token is available
    if (!token) {
      return res.status(403).json({ message: 'Token is missing' });
    }

    logger.info('User:', user);
    logger.info(`Fetched User token successfully: ${token}`);

    res.cookie('token', token, {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      sameSite: 'Strict', // Helps prevent CSRF attacks
    });

    // req.session.userId = user.id;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }

      const id = decoded.token; // Adjust according to your token structure
      const User = await StudentAuthentication.findById(id);

      // Check if user was found
      if (!User) {
        return res.status(404).json({ message: 'User Not Found' });
      }

      logger.info({ User }, 'Fetched User successfully');

      // res.redirect('/')

      // Send the response
      return res.status(200).json({ message: 'Login successful', user: User });
    });
  } catch (error) {
    logger.error({
      message: error.message,
      status: error.status || 500,
      stack: error.stack,
    });

    // Make sure to send a response in case of an error
    if (!res.headersSent) {
      return res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        error: true,
      });
    }
  }
};

export default GoogleAuth_Controller;
