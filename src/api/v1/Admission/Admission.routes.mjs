import { Router } from 'express';
import Admission from './Admission.model.mjs';

import AdmissionController from './Admission.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
const router = Router();

router.post(
  '/v1/online/admission',
  upload.single('avtar'),
  AdmissionController.create
);

router.post(
  '/v1/online/admission/testing-email',
  AdmissionController.sendTestingAdmissionEmail
);

export { router as AdmissionRouter };
