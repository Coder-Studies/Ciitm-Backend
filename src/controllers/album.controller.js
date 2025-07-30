
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

export const deleteMultipleAlbums = async (req, res) => {
  try {
    const { albumIds } = req.body;
    
    if (!albumIds || !Array.isArray(albumIds) || albumIds.length === 0) {
      return res.status(400).json({
        message: 'Album IDs array is required',
        error: true
      });
    }

    logger.info(`Starting bulk deletion process for ${albumIds.length} albums`);

    const bulkResults = {
      totalAlbums: albumIds.length,
      albumsDeleted: 0,
      totalImages: 0,
      imagesDeletedFromDB: 0,
      imagesDeletedFromCloudinary: 0,
      errors: [],
      cloudinaryErrors: []
    };

    // Process all albums in parallel
    const albumDeletionPromises = albumIds.map(async (albumId) => {
      try {
        const album = await Album.findById(albumId).populate('images');
        
        if (!album) {
          return {
            albumId,
            success: false,
            error: 'Album not found'
          };
        }

        // Delete images from Cloudinary in parallel
        const cloudinaryPromises = album.images.map(async (image) => {
          if (image.publicId) {
            try {
              const result = await Delete_From_Cloudinary(image.publicId);
              return { success: result.deleted, publicId: image.publicId };
            } catch (error) {
              return { success: false, publicId: image.publicId, error: error.message };
            }
          }
          return { success: false, publicId: null, error: 'No public ID' };
        });

        const cloudinaryResults = await Promise.all(cloudinaryPromises);
        
        // Delete image records from database
        const imageIds = album.images.map(img => img._id);
        const dbDeleteResult = await Image.deleteMany({ _id: { $in: imageIds } });
        
        // Delete album cover if exists
        if (album.coverImagePublicId) {
          await Delete_From_Cloudinary(album.coverImagePublicId);
        }
        
        // Delete album
        await Album.findByIdAndDelete(albumId);

        return {
          albumId,
          success: true,
          albumTitle: album.title,
          totalImages: album.images.length,
          imagesDeletedFromDB: dbDeleteResult.deletedCount,
          cloudinaryResults
        };

      } catch (error) {
        return {
          albumId,
          success: false,
          error: error.message
        };
      }
    });

    const results = await Promise.all(albumDeletionPromises);

    // Process results
    results.forEach(result => {
      if (result.success) {
        bulkResults.albumsDeleted++;
        bulkResults.totalImages += result.totalImages;
        bulkResults.imagesDeletedFromDB += result.imagesDeletedFromDB;
        
        result.cloudinaryResults.forEach(cr => {
          if (cr.success) {
            bulkResults.imagesDeletedFromCloudinary++;
          } else {
            bulkResults.cloudinaryErrors.push({
              publicId: cr.publicId,
              error: cr.error
            });
          }
        });
      } else {
        bulkResults.errors.push({
          albumId: result.albumId,
          error: result.error
        });
      }
    });

    logger.info(`Bulk deletion completed: ${bulkResults.albumsDeleted}/${bulkResults.totalAlbums} albums deleted`);

    res.status(200).json({
      message: `Bulk deletion completed: ${bulkResults.albumsDeleted}/${bulkResults.totalAlbums} albums deleted successfully`,
      bulkResults,
      error: false
    });

  } catch (error) {
    logger.error({ error }, 'Error in bulk album deletion');
    res.status(500).json({
      message: 'An error occurred during bulk deletion',
      error: true,
      details: error.message
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate album ID
    if (!id) {
      return res.status(400).json({
        message: 'Album ID is required',
        error: true
      });
    }

    // Find the album with populated images
    const album = await Album.findById(id).populate('images');
    
    if (!album) {
      return res.status(404).json({
        message: 'Album not found',
        error: true
      });
    }

    logger.info(`Starting deletion process for album: ${album.title} (ID: ${id})`);

    // Track deletion results
    const deletionResults = {
      albumDeleted: false,
      imagesDeletedFromDB: 0,
      imagesDeletedFromCloudinary: 0,
      cloudinaryErrors: [],
      totalImages: album.images.length
    };

    // Step 1: Delete images from Cloudinary in parallel
    let cloudinaryDeletionPromises = [];
    let coverImageDeletionPromise = null;

    if (album.images && album.images.length > 0) {
      logger.info(`Found ${album.images.length} images to delete from Cloudinary`);

      // Create parallel deletion promises for all images
      cloudinaryDeletionPromises = album.images.map(async (image) => {
        if (!image.publicId) {
          return {
            success: false,
            imageId: image._id,
            publicId: null,
            error: 'No public ID found'
          };
        }

        try {
          const result = await Delete_From_Cloudinary(image.publicId);
          return {
            success: result.deleted,
            imageId: image._id,
            publicId: image.publicId,
            error: result.deleted ? null : result.message
          };
        } catch (error) {
          return {
            success: false,
            imageId: image._id,
            publicId: image.publicId,
            error: error.message
          };
        }
      });
    }

    // Step 2: Delete album cover image from Cloudinary (if exists)
    if (album.coverImagePublicId) {
      coverImageDeletionPromise = Delete_From_Cloudinary(album.coverImagePublicId)
        .then(result => ({ success: result.deleted, error: result.message }))
        .catch(error => ({ success: false, error: error.message }));
    }

    // Step 3: Execute all Cloudinary deletions in parallel
    const [cloudinaryResults, coverResult] = await Promise.all([
      Promise.all(cloudinaryDeletionPromises),
      coverImageDeletionPromise
    ]);

    // Process Cloudinary deletion results
    cloudinaryResults.forEach(result => {
      if (result.success) {
        deletionResults.imagesDeletedFromCloudinary++;
        logger.info(`Successfully deleted image from Cloudinary: ${result.publicId}`);
      } else {
        deletionResults.cloudinaryErrors.push({
          imageId: result.imageId,
          publicId: result.publicId,
          error: result.error
        });
        logger.warn(`Failed to delete image from Cloudinary: ${result.publicId} - ${result.error}`);
      }
    });

    // Handle cover image deletion result
    if (coverResult) {
      if (coverResult.success) {
        logger.info(`Successfully deleted album cover image: ${album.coverImagePublicId}`);
      } else {
        logger.warn(`Failed to delete album cover image: ${album.coverImagePublicId} - ${coverResult.error}`);
      }
    }

    // Step 4: Delete all image records from database in a single operation
    if (album.images && album.images.length > 0) {
      try {
        const imageIds = album.images.map(image => image._id);
        const deleteResult = await Image.deleteMany({ _id: { $in: imageIds } });
        deletionResults.imagesDeletedFromDB = deleteResult.deletedCount;
        logger.info(`Deleted ${deleteResult.deletedCount} image records from database`);
      } catch (dbError) {
        logger.error({ error: dbError }, 'Error deleting image records from database');
        // Don't throw here - we want to continue with album deletion
        // The images might be orphaned but the album deletion should proceed
      }
    }

    // Step 5: Delete the album from database
    try {
      await Album.findByIdAndDelete(id);
      deletionResults.albumDeleted = true;
      logger.info(`Successfully deleted album: ${album.title} (ID: ${id})`);
    } catch (albumDeleteError) {
      logger.error({ error: albumDeleteError }, 'Error deleting album from database');
      throw albumDeleteError; // This is critical - if album deletion fails, we should error
    }

    // Prepare response message
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