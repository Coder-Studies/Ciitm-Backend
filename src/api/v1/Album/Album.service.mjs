import Album from "./Album.model.mjs";

class Album_Service {
  create = async ({ albumName, albumDescription, Url }) => {
    console.log("Album Service", albumName, albumDescription, Url);
    let createdAlbum = await Album.create({
      aName: albumName,
      aDescription: albumDescription,
      aImage_url: Url,
    });

    return createdAlbum;
  };
}

export default new Album_Service();
