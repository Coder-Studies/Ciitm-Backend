import ImageModel from './Image.model.mjs';

class Image_Utils {
  FIND_BY_ALBUM_ID = async (albumId) => {
    return ImageModel.find({ albumID: albumId }).sort({ createdAt: -1 });
  };

  FIND_ALL_IMAGE = async () => {
    return ImageModel.find().sort({ createdAt: -1 });
  };
  NUMBER_OF_IMAGE = async () => {
    try {
      let NUMBER_OF_IMAGE = (await ImageModel.find({})).length;
      return NUMBER_OF_IMAGE;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Image_Utils();
