import { Router } from 'express';
import Admission from './Admission.model.mjs';

import AdmissionController from './Admission.controller.mjs';
const router = Router();

router.post('/v1/online/admission', AdmissionController.create);

export { router as AdmissionRouter };
