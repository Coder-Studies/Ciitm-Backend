import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

/****
 *
 *=====================+++++Importing Utils++++++++++++=========================
 *
 ****/

import upload from '../utils/multerUtils.js';

/****
 *
 *=====================+++++Importing Controllers++++++++++++=========================
 *
 ****/

import { Edit_Profile_Controller } from '../controllers/AdminProfile.controller.js';
import {
  delete_FormData,
  get_FormData,
  view_FormData,
} from '../controllers/contactForm.controller.js';
import {
  getAlbum,
  deleteAlbum,
  deleteMultipleAlbums,
} from '../controllers/album.controller.js';
import { CreateImage, deleteImage, deleteMultipleImages, findAllImages } from '../controllers/image.controller.js';
import {
  Create_Social_Link,
  Edit_Social_link,
} from '../controllers/SocialMedia.controller.js';
// import { Create_Course } from '../controllers/course.controller.js';
import { Delete_Testimonial_Controller } from '../controllers/Tertimonials.controller.js';
import { Create_Frontend_Controller } from '../controllers/Frontend.controller.js';
// import { Create_Admin_Role_Controller } from '../controllers/adminRole.controller.js';
// import { Create_Notice_Controller } from '../controllers/createNotice.controller.js';
import { Send_Mail_Controller } from '../controllers/Mail.controller.js';
// import {
//   Find_Student_Controller,
//   Update_Student_Status_Controller,
// } from '../controllers/StudentAdmission.controller.js';
import { Create_Teacher_Controller } from '../controllers/teacher.controller.js';

/****
 *
 * =====================+++++Routes++++++++++++=========================
 *
 ****/

router.get('/contact/Inbox/message', get_FormData);

router.get('/contact/Inbox/message/view/:id', view_FormData);

router.delete('/contact/Inbox/message/delete/:id', delete_FormData);

router.put('/profile/edit', upload.single('avatar'), Edit_Profile_Controller);

router.get('/album', getAlbum);

// router.post('/create/album', upload.single('albumImage'), createAlbum);

router.post('/send/mail', upload.none(), Send_Mail_Controller);

// router.post('/notice/create', upload.single('doc'), Create_Notice_Controller);
// router.put('/update/status/:uniqueId', Update_Student_Status_Controller);

// router.get('/find/student', Find_Student_Controller);

// router.post('/role/create', upload.none(), Create_Admin_Role_Controller);

router.put('/create/frontend', upload.none(), Create_Frontend_Controller);
router.post(
  '/create/teacher',
  upload.single('Teacher_DP'),
  Create_Teacher_Controller
);

router.delete('/delete/testimonial/:id', Delete_Testimonial_Controller);

router.delete('/delete/albums/:id', deleteAlbum);

router.delete('/delete/albums', deleteMultipleAlbums);

router.delete('/delete/image/:id', deleteImage);

router.delete('/delete/images', deleteMultipleImages);

router.post('/create/image', upload.single('imageFile'), CreateImage);

router.get('/images', findAllImages);

router.post('/create/social/link', upload.none(), Create_Social_Link);

router.put('/edit/social/link', upload.none(), Edit_Social_link);

// router.post('/course/create', Create_Course);
export default router;
