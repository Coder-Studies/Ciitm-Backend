import Album from './Album.model.mjs';

class Album_Utils {
  findAll = async () => {
    return Album.find().sort({ createdAt: -1 });
  };

  findAllAlbumName = async () => {
    return Album.find({}, { aName: 1, _id: 0 }).sort({ createdAt: -1 }).select('aName');
  };

  FindByAlbumName = async (albumName) => {
    console.log(albumName);
    return Album.findOne({ aName: albumName });
  };

  FindByAlbumId = async (albumId) => {
    return Album.findById(albumId);
  };

  findByIdAndDelete = async (albumId) => {
    return Album.findByIdAndDelete(albumId);
  };
  NUMBER_OF_ALBUM = async () => {
    try {
      let NUMBER_OF_ALBUM = (await Album.find({})).length;
      return NUMBER_OF_ALBUM;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Album_Utils();
