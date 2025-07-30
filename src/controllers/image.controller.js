import jwt from 'jsonwebtoken';
import logger from '../middleware/loggerMiddleware.js';
import dotenv from 'dotenv';
import Album from '../models/album.model.js';
import Image from '../models/image.model.js';
import {
  uploadOnCloudinary,
  Delete_From_Cloudinary,
} from '../utils/Cloudinary.mjs';

dotenv.config();

export const CreateImage = async (req, res) => {
  try {
    const { title, description, albumId } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: true
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) {
      return res.status(400).json({
        message: 'Image file is required',
        error: true
      });
    }

 
    const cloudinaryResult = await uploadOnCloudinary(req.file.filename);

    if (cloudinaryResult.error) {
      return res.status(400).json({
        message: 'Error uploading image to Cloudinary',
        error: true
      });
    }


    const newImage = new Image({
      title,
      description,
      url: cloudinaryResult.url,
      publicId: cloudinaryResult.public_id,
      albumId,
      uploadedBy: decoded.id
    });

    const savedImage = await newImage.save();

   
    await Album.findByIdAndUpdate(albumId, {
      $push: { images: savedImage._id }
    });

    res.status(201).json({
      message: 'Image created successfully',
      data: savedImage,
      error: false
    });

  } catch (error) {
    logger.error({ error }, 'Error creating image');
    res.status(500).json({
      message: 'Error creating image',
      error: true
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const findImage = await Image.findById(id).populate('albumId');

    if (!findImage) {
      return res.status(404).json({
        message: 'Image not found',
        error: true
      });
    }

    const findAlbum = await Album.findById(findImage.albumId);

   
    const deletedImage = await Delete_From_Cloudinary(findImage.publicId);

    if (deletedImage.deleted) {
     
      const deletedImageRecord = await Image.findByIdAndDelete(id);

      if (!deletedImageRecord) {
        return res.status(500).json({
          message: 'Error deleting image from database',
          error: true
        });
      }

    
      if (findAlbum) {
        const imageIndex = findAlbum.images.indexOf(id);
        if (imageIndex > -1) {
          findAlbum.images.splice(imageIndex, 1);
          await findAlbum.save();
        }
      }

      res.status(200).json({
        message: 'Image deleted successfully',
        deletedFromCloudinary: deletedImage.message,
        deletedFromDatabase: true,
        error: false
      });
    } else {
      res.status(400).json({
        message: 'Failed to delete image from Cloudinary',
        cloudinaryError: deletedImage.message,
        error: true
      });
    }
  } catch (error) {
    logger.error({ error }, 'Error deleting image');
    res.status(500).json({
      message: 'Error deleting image',
      error: true
    });
  }
};

export const findAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate('albumId', 'title')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Images retrieved successfully',
      data: images,
      error: false
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching images');
    res.status(500).json({
      message: 'Error fetching images',
      error: true
    });
  }
};
