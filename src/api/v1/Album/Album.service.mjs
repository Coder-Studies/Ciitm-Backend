import AlbumConstant from './Album.constant.mjs';
import Album from './Album.model.mjs';
import AlbumUtils from './Album.utils.mjs';

class Album_Service {
  create = async ({ albumName, albumDescription, Url }) => {
    console.log('Album Service', albumName, albumDescription, Url);
    let createdAlbum = await Album.create({
      aName: albumName,
      aDescription: albumDescription,
      aImage_url: Url,
    });

    return createdAlbum;
  };

  delete = async (albumId) => {
    let deletedAlbum = await AlbumUtils.findByIdAndDelete(albumId);
    // let Delete_All_Image =

    if (!deletedAlbum) {
      throw new Error(AlbumConstant.NOT_DELETED);
    }
    return deletedAlbum;
  };
}

export default new Album_Service();
