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
