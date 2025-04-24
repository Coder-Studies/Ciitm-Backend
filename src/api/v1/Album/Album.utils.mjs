import Album from './Album.model.mjs';

class Album_Utils {
  findAll = async () => {
    return Album.find();
  };

  FindByAlbumName = async (albumName) => {
    console.log(albumName);
    return Album.findOne({ aName: albumName });
  };
}

export default new Album_Utils();
