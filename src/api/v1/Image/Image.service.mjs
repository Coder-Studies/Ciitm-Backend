import ImageModel from './Image.model.mjs';

class Image_Service {
  create = async ({ userID, albumID, url }) => {
    let createdImage = await ImageModel.create({
      userID: userID,
      albumID: albumID,
      url: url,
    });

    return createdImage;
  };
}

export default new Image_Service();
