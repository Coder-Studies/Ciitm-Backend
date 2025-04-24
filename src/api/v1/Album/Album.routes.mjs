import { Router } from 'express';
const router = Router();
import upload from '../../../utils/multerUtils.mjs';
import AlbumController from './Album.controller.mjs';

router.post(
  '/v1/admin/create/album',
  upload.single('albumImage'),
  AlbumController.createAlbum
);

router.delete('/v1/admin/delete/album/:albumId', AlbumController.deleteAlbum);

export { router as AlbumRoutes };
