import { Router } from 'express';
const router = Router();
import upload from '../../../utils/multerUtils.mjs';
import AlbumController from './Album.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

router.post(
  '/v1/admin/create/album',
  AuthMiddleware.Admin,
  upload.single('albumImage'),
  AlbumController.createAlbum
);

router.delete('/v1/admin/delete/album/:albumId', AuthMiddleware.Admin, AlbumController.deleteAlbum);

router.get('/v1/user/get/album', AlbumController.getAlbum);

export { router as AlbumRoutes };
