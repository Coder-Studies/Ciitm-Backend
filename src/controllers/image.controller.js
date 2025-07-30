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

    // Find the image with album information
    const findImage = await Image.findById(id);

    if (!findImage) {
      return res.status(404).json({
        message: 'Image not found',
        error: true
      });
    }

    logger.info(`Starting deletion process for image: ${id}`);

    // Track deletion results
    const deletionResults = {
      imageDeletedFromDB: false,
      imageDeletedFromCloudinary: false,
      albumUpdated: false,
      cloudinaryError: null
    };

    // Step 1: Delete from Cloudinary
    const cloudinaryResult = await Delete_From_Cloudinary(findImage.publicId);
    
    if (cloudinaryResult.deleted) {
      deletionResults.imageDeletedFromCloudinary = true;
      logger.info(`Successfully deleted image from Cloudinary: ${findImage.publicId}`);
    } else {
      deletionResults.cloudinaryError = cloudinaryResult.message;
      logger.warn(`Failed to delete image from Cloudinary: ${findImage.publicId} - ${cloudinaryResult.message}`);
    }

    // Step 2: Delete image record from database
    try {
      const deletedImageRecord = await Image.findByIdAndDelete(id);
      
      if (deletedImageRecord) {
        deletionResults.imageDeletedFromDB = true;
        logger.info(`Successfully deleted image from database: ${id}`);
      }
    } catch (dbError) {
      logger.error({ error: dbError }, 'Error deleting image from database');
      throw dbError; // This is critical - if DB deletion fails, we should error
    }

    // Step 3: Remove image reference from album using $pull operator
    try {
      await Album.findByIdAndUpdate(findImage.albumId, { 
        $pull: { images: id } 
      });
      deletionResults.albumUpdated = true;
      logger.info(`Successfully removed image reference from album: ${findImage.albumId}`);
    } catch (albumError) {
      logger.error({ error: albumError }, 'Error updating album after image deletion');
      // Don't throw here - the image is already deleted, this is cleanup
    }

    // Prepare response
    let message = 'Image deleted successfully';
    if (!deletionResults.imageDeletedFromCloudinary) {
      message += ' (Warning: Failed to delete from Cloudinary)';
    }

    res.status(200).json({
      message,
      deletionSummary: {
        imageDeletedFromDB: deletionResults.imageDeletedFromDB,
        imageDeletedFromCloudinary: deletionResults.imageDeletedFromCloudinary,
        albumUpdated: deletionResults.albumUpdated,
        cloudinaryError: deletionResults.cloudinaryError
      },
      error: false
    });

  } catch (error) {
    logger.error({ error, imageId: req.params.id }, 'Error deleting image');
    res.status(500).json({
      message: 'Error deleting image',
      error: true,
      details: error.message
    });
  }
};

export const deleteMultipleImages = async (req, res) => {
  try {
    const { imageIds } = req.body;
    
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        message: 'Image IDs array is required',
        error: true
      });
    }

    logger.info(`Starting bulk deletion process for ${imageIds.length} images`);

    const bulkResults = {
      totalImages: imageIds.length,
      imagesDeletedFromDB: 0,
      imagesDeletedFromCloudinary: 0,
      albumsUpdated: 0,
      errors: [],
      cloudinaryErrors: []
    };

    // Step 1: Find all images to get their details
    const images = await Image.find({ _id: { $in: imageIds } });
    
    if (images.length === 0) {
      return res.status(404).json({
        message: 'No images found with provided IDs',
        error: true
      });
    }

    // Step 2: Delete from Cloudinary in parallel
    const cloudinaryPromises = images.map(async (image) => {
      try {
        const result = await Delete_From_Cloudinary(image.publicId);
        return {
          imageId: image._id,
          publicId: image.publicId,
          success: result.deleted,
          error: result.deleted ? null : result.message
        };
      } catch (error) {
        return {
          imageId: image._id,
          publicId: image.publicId,
          success: false,
          error: error.message
        };
      }
    });

    const cloudinaryResults = await Promise.all(cloudinaryPromises);

    // Process Cloudinary results
    cloudinaryResults.forEach(result => {
      if (result.success) {
        bulkResults.imagesDeletedFromCloudinary++;
      } else {
        bulkResults.cloudinaryErrors.push({
          imageId: result.imageId,
          publicId: result.publicId,
          error: result.error
        });
      }
    });

    // Step 3: Delete image records from database in batch
    try {
      const dbDeleteResult = await Image.deleteMany({ _id: { $in: imageIds } });
      bulkResults.imagesDeletedFromDB = dbDeleteResult.deletedCount;
      logger.info(`Deleted ${dbDeleteResult.deletedCount} image records from database`);
    } catch (dbError) {
      logger.error({ error: dbError }, 'Error deleting images from database');
      bulkResults.errors.push({
        operation: 'database_deletion',
        error: dbError.message
      });
    }

    // Step 4: Update albums to remove image references
    try {
      // Group images by album for efficient updates
      const albumGroups = {};
      images.forEach(image => {
        if (!albumGroups[image.albumId]) {
          albumGroups[image.albumId] = [];
        }
        albumGroups[image.albumId].push(image._id);
      });

      // Update each album
      const albumUpdatePromises = Object.entries(albumGroups).map(async ([albumId, imageIds]) => {
        try {
          await Album.findByIdAndUpdate(albumId, {
            $pull: { images: { $in: imageIds } }
          });
          return { albumId, success: true };
        } catch (error) {
          return { albumId, success: false, error: error.message };
        }
      });

      const albumResults = await Promise.all(albumUpdatePromises);
      bulkResults.albumsUpdated = albumResults.filter(r => r.success).length;

      // Track album update errors
      albumResults.filter(r => !r.success).forEach(result => {
        bulkResults.errors.push({
          operation: 'album_update',
          albumId: result.albumId,
          error: result.error
        });
      });

    } catch (albumError) {
      logger.error({ error: albumError }, 'Error updating albums after bulk image deletion');
      bulkResults.errors.push({
        operation: 'album_updates',
        error: albumError.message
      });
    }

    logger.info(`Bulk image deletion completed: ${bulkResults.imagesDeletedFromDB}/${bulkResults.totalImages} images deleted`);

    res.status(200).json({
      message: `Bulk deletion completed: ${bulkResults.imagesDeletedFromDB}/${bulkResults.totalImages} images deleted successfully`,
      bulkResults,
      error: false
    });

  } catch (error) {
    logger.error({ error }, 'Error in bulk image deletion');
    res.status(500).json({
      message: 'An error occurred during bulk image deletion',
      error: true,
      details: error.message
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
