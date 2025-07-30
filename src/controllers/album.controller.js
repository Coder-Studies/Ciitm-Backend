
import logger from '../middleware/loggerMiddleware.js';
import dotenv from 'dotenv';
import Album from '../models/album.model.js';
import Image from '../models/image.model.js';
import { Delete_From_Cloudinary } from '../utils/Cloudinary.mjs';

dotenv.config();

export const getAlbum = async (req, res) => {
  try {
    const albums = await Album.find()
      .populate('images')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Albums retrieved successfully',
      data: albums,
      error: false
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching albums');
    res.status(500).json({
      message: 'Error fetching albums',
      error: true
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    
   
    if (!id) {
      return res.status(400).json({
        message: 'Album ID is required',
        error: true
      });
    }

    
    const album = await Album.findById(id).populate('images');
    
    if (!album) {
      return res.status(404).json({
        message: 'Album not found',
        error: true
      });
    }

    logger.info(`Starting deletion process for album: ${album.title} (ID: ${id})`);

    
    const deletionResults = {
      albumDeleted: false,
      imagesDeletedFromDB: 0,
      imagesDeletedFromCloudinary: 0,
      cloudinaryErrors: [],
      totalImages: album.images.length
    };

   
    if (album.images && album.images.length > 0) {
      logger.info(`Found ${album.images.length} images to delete`);

      for (const image of album.images) {
        try {
       
          if (image.publicId) {
            const cloudinaryResult = await Delete_From_Cloudinary(image.publicId);
            
            if (cloudinaryResult.deleted) {
              deletionResults.imagesDeletedFromCloudinary++;
              logger.info(`Successfully deleted image from Cloudinary: ${image.publicId}`);
            } else {
              deletionResults.cloudinaryErrors.push({
                imageId: image._id,
                publicId: image.publicId,
                error: cloudinaryResult.message
              });
              logger.warn(`Failed to delete image from Cloudinary: ${image.publicId} - ${cloudinaryResult.message}`);
            }
          }

        
          await Image.findByIdAndDelete(image._id);
          deletionResults.imagesDeletedFromDB++;
          logger.info(`Deleted image from database: ${image._id}`);

        } catch (imageError) {
          logger.error({ 
            error: imageError, 
            imageId: image._id 
          }, 'Error deleting individual image');
          
          deletionResults.cloudinaryErrors.push({
            imageId: image._id,
            publicId: image.publicId,
            error: imageError.message
          });
        }
      }
    }

   
    if (album.coverImagePublicId) {
      try {
        const coverResult = await Delete_From_Cloudinary(album.coverImagePublicId);
        if (!coverResult.deleted) {
          logger.warn(`Failed to delete album cover image: ${album.coverImagePublicId} - ${coverResult.message}`);
        } else {
          logger.info(`Successfully deleted album cover image: ${album.coverImagePublicId}`);
        }
      } catch (coverError) {
        logger.error({ error: coverError }, 'Error deleting album cover image');
      }
    }

    
    await Album.findByIdAndDelete(id);
    deletionResults.albumDeleted = true;
    
    logger.info(`Successfully deleted album: ${album.title} (ID: ${id})`);

   
    let message = `Album "${album.title}" deleted successfully`;
    if (deletionResults.cloudinaryErrors.length > 0) {
      message += `. Warning: ${deletionResults.cloudinaryErrors.length} images failed to delete from Cloudinary`;
    }

    res.status(200).json({
      message,
      deletionSummary: {
        albumDeleted: deletionResults.albumDeleted,
        totalImages: deletionResults.totalImages,
        imagesDeletedFromDB: deletionResults.imagesDeletedFromDB,
        imagesDeletedFromCloudinary: deletionResults.imagesDeletedFromCloudinary,
        cloudinaryErrors: deletionResults.cloudinaryErrors
      },
      error: false
    });

  } catch (error) {
    logger.error({ error, albumId: req.params.id }, 'Error deleting album');
    
    res.status(500).json({
      message: 'An error occurred while deleting the album',
      error: true,
      details: error.message
    });
  }
};