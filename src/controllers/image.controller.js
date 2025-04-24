// import jwt from 'jsonwebtoken';
// import logger from '../middleware/loggerMiddleware.js';
// import dotenv from 'dotenv';
// import albumSchema from '../models/album.model.js';
// import imageSchema from '../models/image.model.js';
// import fs from 'fs';
// import {
//   uploadOnCloudinary,
//   Delete_From_Cloudinary,
// } from '../utils/Cloudinary.mjs';

// import { ImageSchemaJoi } from '../validation/ImageSchema.Joi.js';
// import Authentication from '../api/v1/Auth/Auth.model.mjs';
// import { Admin_Contant } from '../constant/Admin.constant.js';
// import { Album_Contant } from '../constant/Album.constant.js';
// import { Image_Constant } from '../constant/Image.const.js';
// import Album from '../models/album.model.js';
// import path from 'path';

// export const CreateImage =

// export const deleteImage = async (req, res) => {
//   try {
//     let { id } = req.params;

//     let findImage = await imageSchema.findById(id).populate('albumID');

//     if (!findImage) {
//       let error = new Error('image Not Found');
//       error.status = 404;
//       throw error;
//     }

//     let findAlbum = await albumSchema.findById(findImage.albumID);

//     let DeletedImage = await Delete_From_Cloudinary(findImage.url);

//     let Delete_Image = imageSchema.findByIdAndDelete(id);

//     if (DeletedImage.deleted) {
//       let Delete_Image = await imageSchema.findByIdAndDelete(id);

//       if (!Delete_Image) {
//         let error = new Error('Error Deleting Image');
//         error.status = 500;
//         throw error;
//       }

//       let indexOf = (id) => findAlbum.images.indexOf(id);

//       findAlbum.images.splice(indexOf(id), 1);

//       await findAlbum.save();

//       res.status(200).json({
//         message: DeletedImage.message,
//         public_id: DeletedImage.public_id,
//         Delete_Image: Delete_Image,
//       });
//     } else {
//       res.status(DeletedImage.stack || 404).json({
//         message: DeletedImage.message,
//         public_id: DeletedImage.public_id,
//         findImage: findImage,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       error: true,
//     });
//   }
// };

// export const findImage =

// export const findAllImages = async (req, res) => {
//   try {
//     let Find_All_Images = await imageSchema.find().sort({ createdAt: -1 });
//     if (!Find_All_Images) {
//       let error = new Error('No images found');
//       error.status = 404;
//       throw error;
//     }
//     res.status(200).json({
//       message: 'All Images found',
//       data: Find_All_Images,
//     });
//   } catch (error) {
//     res.status(error.status || 500).json({
//       message: error.message || 'Error fetching images',
//       error: true,
//     });
//   }
// };
