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
import io from '../config/Socket/SocketServer.mjs';
import SocketEvent from '../config/Socket/SocketEvent.mjs';
import cookieParser from 'cookie-parser';
import { CourseRouter } from '../api/v1/Course/course.routes.mjs';
import { TeacherRouter } from '../api/v1/Teacher/Teacher.routes.mjs';
import { StudentRouter } from '../api/v1/Student/Student.routes.mjs';
import forgotPasswordRouter from '../api/v1/forget-password/ForgotPassword.routes.mjs';
import { Fee_Routes } from '../api/v1/Fee/fee.routes.mjs';
import { ChatRouter } from '../api/v1/Chat/Chat.routes.mjs';
import { TestimonialRouter } from '../api/v1/Testimonial/Testimonial.routes.mjs';

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  '/api',
  AuthRouter,
  RoleRouter,
  StatusRouter,
  AdmissionRouter,
  FrontendRouter,
  ContactRouter,
  AlbumRoutes,
  forgotPasswordRouter,
  ImageRoutes,
  NoticeRouter,
  user,
  Fee_Routes,
  CourseRouter,
  TeacherRouter,
  StudentRouter,
  ChatRouter,
  TestimonialRouter
);

export default app;
