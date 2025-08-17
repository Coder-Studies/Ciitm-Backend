import Authentication_Schema from '../api/v1/Auth/Auth.model.mjs';
import jwt from 'jsonwebtoken';
import logger from '../middleware/loggerMiddleware.js';
import dotenv from 'dotenv';
import {
  uploadOnCloudinary,
  Delete_From_Cloudinary,
} from '../utils/Cloudinary.mjs';

dotenv.config({ path: '../../.env' });

export const Edit_Profile_Controller = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    logger.info(`Token:- ${token}`);

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: true,
      });
    }

    logger.info(`key:- ${process.env.JWT_SECRET}`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    logger.info({ decoded }, 'Decoded User');

    let { name, email } = await req.body;

    logger.info(
      {
        name: name,
        email: email,
        // filename: filename,
      },
      'Form Data'
    );

    let findUser = await Authentication_Schema.findOne({
      email: decoded.email,
    });
    console.warn(findUser);

    if (!req.file) {
      const updatedUser = await Authentication_Schema.findOneAndUpdate(
        { email: decoded.email },
        {
          $set: {
            name: name, // Update name if provided
            email: email, // Update email if provided
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found', error: true });
      }

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } else {
      let { filename } = await req.file;

      let Deleted_Image = await Delete_From_Cloudinary(findUser.Public_Id);

      if (!Deleted_Image.error) {
        const Cloudinary = await uploadOnCloudinary(filename); // Assuming `uploadOnCloudinary` returns Cloudinary data

        if (Cloudinary.error) {
          return res.status(400).json({
            message: 'Error uploading image to Cloudinary',
            error: true,
          });
        }

        console.log('Uploaded image URL:', Cloudinary.url);

        //   // Update user profile in the database
        const updatedUser = await Authentication_Schema.findOneAndUpdate(
          { email: decoded.email },
          {
            $set: {
              name: name || decoded.name,
              email: email || decoded.email,
              picture: Cloudinary.url,
              Public_Id: Cloudinary.public_id,
            },
          },
          { new: true }
        );

        if (!updatedUser) {
          return res
            .status(404)
            .json({ message: 'User not found', error: true });
        }

        // Respond with the updated user information
        return res.status(200).json({
          message: 'Profile updated successfully',
          user: updatedUser,
        });
      }
    }
  } catch (error) {
    // Log the error to the logger middleware for better debugging
    logger.error({ error }, 'Error From Update Profile');

    // Send a response with a generic error message
    return res.status(500).json({
      message: 'An error occurred while updating the profile.',
      error: true,
    });
  }
};
