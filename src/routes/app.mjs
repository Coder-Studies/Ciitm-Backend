import express from 'express';
const app = express();
import { AuthRouter } from '../api/v1/Auth/Auth.routes.mjs';
import { RoleRouter } from '../api/v1/Role/Role.routes.mjs';
import { StatusRouter } from '../api/v1/Status/Status.routes.mjs';
import { AdmissionRouter } from '../api/v1/Admission/Admission.routes.mjs';
import { user } from './index.mjs';
import { FrontendRouter } from '../api/v1/frontend/frontend.routes.mjs';
import { ContactRouter } from '../api/v1/Contact/Contact.routes.mjs';
import { NoticeRouter } from '../api/v1/Notice/notice.routes.mjs';
import { AlbumRoutes } from '../api/v1/Album/Album.routes.mjs';
import { ImageRoutes } from '../api/v1/Image/Image.routes.mjs';
import bodyParser from 'body-parser';

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  '/api',
  AuthRouter,
  RoleRouter,
  StatusRouter,
  AdmissionRouter,
  FrontendRouter,
  ContactRouter,
  AlbumRoutes,
  ImageRoutes,
  NoticeRouter,
  user
);

export default app;
