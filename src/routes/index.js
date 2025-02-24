import express, { Router } from 'express';
import dotenv from 'dotenv';
import upload from '../utils/multerUtils.js';

import GoogleOAuth2 from '../OAuth2Client/GoogleStrategy.js';

dotenv.config();

import { Handle_ContactForm } from '../controllers/contactForm.controller.js';
import { getAlbum } from '../controllers/album.controller.js';
import { findImage } from '../controllers/image.controller.js';
import { Find_Social_link } from '../controllers/SocialMedia.controller.js';
import handle_LogOut from '../controllers/LogOut.controller.js';
import {
  Find_Student_Status_Controller,
  Handle_newStudent_Record,
  Handle_StudentFee_Paid,
} from '../controllers/StudentAdmission.controller.js';
import {
  Create_Testimonial_Controller,
  Find_Testimonial_Controller,
} from '../controllers/Tertimonials.controller.js';
import { Find_Frontend_Controller } from '../controllers/Frontend.controller.js';
import { Login } from '../controllers/Login.controller.js';
import { Find_Notice_Controller } from '../controllers/createNotice.controller.js';
import { Find_Teacher_Controller } from '../controllers/teacher.controller.js';
import { SignUp_Admin } from '../controllers/Admin_Sign_Up.controller.js';
import {
  ForgotPassword_Controller,
  ResetPassword_Controller,
} from '../controllers/forgotPassword.controller.js';

var router = express.Router();

router.post('/auth/google', GoogleOAuth2);

router.get('/frontend', Find_Frontend_Controller);

router.post('/pay/fee', Handle_StudentFee_Paid);

router.post('/student/admission', Handle_newStudent_Record);

router.get('/auth/google/failure', (req, res) => {
  res.status(404).json({
    message: 'Authentication failed',
    error: true,
  });
});

router.get('/frontend', Find_Frontend_Controller);
router.get('/find/student/status/:uniqueId', Find_Student_Status_Controller);

router.get('/find/teacher', Find_Teacher_Controller);

router.get('/notice', Find_Notice_Controller);

router.post(
  '/admission/student',
  upload.single('avtar'),
  Handle_newStudent_Record
);

router.post('/contact/form/submit', Handle_ContactForm);

router.post('/signup/admin', upload.single('Profile_Picture'), SignUp_Admin);

router.get('/logOut', handle_LogOut);

router.get('/link', Find_Social_link);

router.post('/login', Login);

router.get('/albums', getAlbum);

router.get('/image/:Album__Name', findImage);

router.post(
  '/create/testimonial',
  upload.single('image'),
  Create_Testimonial_Controller
);

router.get('/find/testimonial', Find_Testimonial_Controller);

router.post('/forgot/password', ForgotPassword_Controller);
router.post('/reset/password', ResetPassword_Controller);

export default router;
