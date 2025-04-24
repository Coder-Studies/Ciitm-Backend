import { request, response } from 'express';
import AlbumConstant from './Album.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import AlbumService from './Album.service.mjs';
import Create_Album_Validator from './Album.validator.mjs';
import AlbumUtils from './Album.utils.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';

class Album_Controller {
  createAlbum = async (req = request, res = response) => {
    try {
      let { albumName, albumDescription } = req.body;
      let { filename } = req.file;

      console.log(req.file);

      if (!filename) {
        throw new Error(AlbumConstant.IMAGE_NOT_FOUND);
      }

      let Find_Album = await AlbumUtils.FindByAlbumName(albumName);
      console.log(Find_Album);

      if (Find_Album) {
        throw new Error(AlbumConstant.ALBUM_FOUND);
      }

      let Cloudinary = await uploadOnCloudinary(filename);

      if (!Cloudinary) {
        throw new Error(AlbumConstant.CLOUDINARY_ERROR);
      }

      let { error } = await Create_Album_Validator.validate({
        albumName: albumName,
        albumImageUrl: Cloudinary.url,
        albumDescription: albumDescription,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      console.log('Cloudinary', Cloudinary);
      console.log('Cloudinary URL', Cloudinary.url);
      let createdAlbum = await AlbumService.create({
        albumName: albumName,
        albumDescription: albumDescription, 
        Url: Cloudinary.url,
      });

      if (!createdAlbum) {
        throw new Error(AlbumConstant.ALBUM_NOT_CREATED);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AlbumConstant.ALBUM_CREATED,
        createdAlbum
      );
    } catch (error) {
      console.log(error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };
}

export default new Album_Controller();
