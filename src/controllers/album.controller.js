// import AlbumSchemaJoi from '../validation/AlbumSchemaJoi.js';
// import albumSchema from '../models/album.model.js';
// import fs from 'fs';
// import {
//   uploadOnCloudinary,
//   Delete_From_Cloudinary,
// } from '../utils/Cloudinary.mjs';
// import logger from '../middleware/loggerMiddleware.js';
// import { Album_Contant } from '../constant/Album.constant.js';

// export const deleteAlbum = async (req, res) => {
//   try {
//     let { id } = req.params;

//     let findAlbum = await albumSchema.findById(id);

//     if (!findAlbum) {
//       throw new Error(Album_Contant.Not_Found);
//     }

//     let DeletedImage = await Delete_From_Cloudinary(findAlbum.aImage_url);

//     if (DeletedImage.deleted) {
//       let delete_Album = await albumSchema.findByIdAndDelete(id);

//       if (!delete_Album) {
//         throw new Error(Album_Contant.Not_Deleted);
//       }

//       res.status(200).json({
//         message: DeletedImage.message,
//         public_id: DeletedImage.public_id,
//         findAlbum: findAlbum,
//       });
//     }
//   } catch (error) {
//     logger.error(`Error creating album: ${error.message}`);
//     res.status(500).json({
//       message: error.message,
//       error: true,
//     });
//   }
// };

// export const getAlbum = async (req, res) => {
//   try {
//     let getAlbum = await albumSchema.find().sort({ createdAt: -1 });

//     if (!getAlbum.length) {
//       logger.warn('No albums found');
//       return res.status(404).json({
//         message: 'No albums found',
//         no_OF_Album: getAlbum.length,
//         error: true,
//       });
//     }

//     res.json(getAlbum);
//   } catch (error) {
//     console.log(error);
//     logger.error(`Error fetching albums: ${error.message}`);
//     res.status(500).json({
//       message: error.message,
//       error: true,
//     });
//   }
// };
