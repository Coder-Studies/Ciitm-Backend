import ImageModel from './Image.model.mjs';

class Image_Utils {
  FIND_BY_ALBUM_ID = async (albumId) => {
    return ImageModel.find({ albumID: albumId }).sort({ createdAt: -1 });
  };

  FIND_ALL_IMAGE = async () => {
    return ImageModel.find().sort({ createdAt: -1 });
  };
}

export default new Image_Utils();
