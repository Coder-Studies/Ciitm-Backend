import Album from './Album.model.mjs';

class Album_Utils {
  findAll = async () => {
    return Album.find();
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
}

export default new Album_Utils();
