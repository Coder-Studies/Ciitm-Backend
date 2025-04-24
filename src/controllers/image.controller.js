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

// export const CreateImage = async (req, res) => {
//   try {
//     const { albumName } = req.body;
//     const { filename } = req.file;
//     const token = req.cookies.token;

//     let email = await Authentication.DecordToken(token);

//     let find_Admin = await Authentication.findOne({ email: email });

//     if (!find_Admin) {
//       return res.status(404).json({ message: Admin_Contant.Not_Found });
//     }

//     const findAlbum = await albumSchema.findOne({ aName: albumName });

//     if (!findAlbum) {
//       const error = new Error(Album_Contant.Not_Found);
//       error.status = 404;
//       throw error;
//     }

//     console.log('filename', filename);

//     let Cloudinary = await uploadOnCloudinary(filename);

//     if (!Cloudinary) {
//       return res
//         .status(400)
//         .json({ message: 'Error uploading image to Cloudinary' });
//     }

//     const { error: validationError } = await ImageSchemaJoi.validateAsync({
//       albumName: findAlbum.aName,
//       userID: find_Admin._id.toString(),
//       url: Cloudinary.url,
//     });

//     if (validationError) {
//       throw new Error(validationError.message);
//     }

//     let createdImage = await imageSchema.create({
//       userID: find_Admin._id.toString(),
//       albumID: findAlbum._id,
//       url: Cloudinary.url,
//     });

//     if (!createdImage) {
//       let error = new Error(Image_Constant.Not_Created);
//       error.status = 500;
//       throw error;
//     }

//     findAlbum.images.push(createdImage._id.toString());
//     await findAlbum.save();

//     res.status(200).json({
//       message: Image_Constant.Created,
//       created: true,
//       data: createdImage,
//     });
//   } catch (error) {
//     console.error(error); // Use console.error for logging errors
//     res.status(error.status || 500).json({
//       message: error.message || Image_Constant.Not_Created,
//       error: true,
//     });
//   }
// };

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

// export const findImage = async (req, res) => {
//   try {
//     const { Album__Name } = req.params;

//     const Find_Album = await albumSchema
//       .findOne({ aName: Album__Name })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: 'images',
//       });

//     if (!Find_Album) {
//       res.status(404).json({
//         message: Image_Constant.Not_Found,
//         error: true,
//       });
//     } else {
//       res.status(200).json({
//         message: Image_Constant.Find,
//         data: Find_Album.images,
//       });
//     }
//   } catch (error) {
//     logger.error(`Error fetching images: ${error.message}`);
//     res.status(error.status || 500).json({
//       message: error.message || 'Error fetching images',
//       error: true,
//     });
//     p;
//   }
// };

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
