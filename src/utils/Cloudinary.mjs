import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
(async function () {
  // Configuration

  cloudinary.config({
    cloud_name: process.env.Cloudinary_Cloud_Name,
    api_key: process.env.Cloudinary_API_Key,
    api_secret: process.env.Cloudinary_API_Secret, // Click 'View API Keys' above to copy your API secret
  });
})();

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    let localFileName = path.basename(localFilePath);

    if (!localFilePath) {
      throw new Error('File not found');
    }

    const uploadResult = await cloudinary.uploader
      .upload(`public/upload/${path.basename(localFilePath)}`, {
        public_id: localFileName,
        resource_type: 'auto',
      })
      .catch((error) => {
        throw Error(error.message);
      });

    fs.renameSync(
      `public/upload/${localFilePath}`,
      `public/upload/${uploadResult.public_id}`
    );

    let ImageDetail = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      original_filename: uploadResult.original_filename,
    };

    return ImageDetail;
  } catch (error) {
    fs.unlinkSync(`public/upload/${localFilePath}`);
    throw Error(error.message);
  }
};

export const Delete_From_Cloudinary = async (publicIdOrUrl) => {
  try {
    let public_id;
    
    // If it's a URL, extract the public ID
    if (publicIdOrUrl.includes('cloudinary.com') || publicIdOrUrl.includes('http')) {
      // Extract public ID from Cloudinary URL
      const urlParts = publicIdOrUrl.split('/');
      const fileWithExtension = urlParts[urlParts.length - 1];
      public_id = fileWithExtension.split('.')[0];
    } else {
      // It's already a public ID
      public_id = publicIdOrUrl;
    }

    console.log('Public ID to delete:', public_id);

    let delete_Image = await cloudinary.uploader.destroy(public_id);

    console.log('Cloudinary delete result:', delete_Image);

    if (delete_Image.result === 'ok' || delete_Image.result === 'not found') {
      // Try to remove local file if it exists
      try {
        const localPath = `public/upload/${public_id}`;
        if (fs.existsSync(localPath)) {
          fs.rmSync(localPath);
        }
      } catch (fsError) {
        console.warn('Local file removal failed:', fsError.message);
      }

      let delete_Image_Detail = {
        message: `Image deleted from Cloudinary: ${public_id}`,
        public_id: public_id,
        deleted: true,
        cloudinaryResult: delete_Image.result
      };

      return delete_Image_Detail;
    }

    let failed_Delete_Image = {
      message: `Failed to delete image from Cloudinary: ${delete_Image.result}`,
      public_id: public_id,
      deleted: false,
      cloudinaryResult: delete_Image.result
    };

    return failed_Delete_Image;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return {
      message: `Error deleting from Cloudinary: ${error.message}`,
      deleted: false,
      error: error.message
    };
  }
};

export const Delete_Multiple_From_Cloudinary = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return {
        message: 'No public IDs provided',
        deleted: false,
        results: []
      };
    }

    console.log(`Batch deleting ${publicIds.length} images from Cloudinary`);

    // Cloudinary supports batch deletion with up to 100 public IDs at once
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < publicIds.length; i += batchSize) {
      batches.push(publicIds.slice(i, i + batchSize));
    }

    const batchResults = await Promise.all(
      batches.map(async (batch) => {
        try {
          // Use Cloudinary's delete_resources method for batch deletion
          const result = await cloudinary.api.delete_resources(batch);
          return {
            success: true,
            deleted: result.deleted,
            partial: result.partial,
            rate_limit_allowed: result.rate_limit_allowed,
            rate_limit_reset_at: result.rate_limit_reset_at
          };
        } catch (error) {
          console.error('Batch deletion error:', error);
          return {
            success: false,
            error: error.message,
            batch
          };
        }
      })
    );

    // Process results
    let totalDeleted = 0;
    let totalFailed = 0;
    const failedIds = [];

    batchResults.forEach(result => {
      if (result.success) {
        totalDeleted += Object.keys(result.deleted).length;
        // Check for partial failures
        if (result.partial) {
          Object.entries(result.deleted).forEach(([publicId, status]) => {
            if (status !== 'deleted') {
              totalFailed++;
              failedIds.push({ publicId, status });
            }
          });
        }
      } else {
        totalFailed += result.batch ? result.batch.length : 0;
        if (result.batch) {
          result.batch.forEach(publicId => {
            failedIds.push({ publicId, error: result.error });
          });
        }
      }
    });

    // Clean up local files for successfully deleted images
    publicIds.forEach(publicId => {
      try {
        const localPath = `public/upload/${publicId}`;
        if (fs.existsSync(localPath)) {
          fs.rmSync(localPath);
        }
      } catch (fsError) {
        console.warn(`Local file removal failed for ${publicId}:`, fsError.message);
      }
    });

    return {
      message: `Batch deletion completed: ${totalDeleted} deleted, ${totalFailed} failed`,
      deleted: totalFailed === 0,
      totalRequested: publicIds.length,
      totalDeleted,
      totalFailed,
      failedIds,
      batchResults
    };

  } catch (error) {
    console.error('Batch Cloudinary deletion error:', error);
    return {
      message: `Error in batch deletion: ${error.message}`,
      deleted: false,
      error: error.message
    };
  }
};
