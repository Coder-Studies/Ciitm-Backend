import express from 'express';
import EmailController from './Email.controller.mjs';

const router = express.Router();

// Payment Confirmation Email Route
router.post('/payment-confirmation', EmailController.sendPaymentConfirmation);

// Admission Confirmation Email Route
router.post('/admission-confirmation', EmailController.sendAdmissionConfirmation);

export default router; 