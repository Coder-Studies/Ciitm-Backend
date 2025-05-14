process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'testpass';

import { jest } from '@jest/globals';

// ✅ Mock nodemailer before imports
jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    }),
  },
}));

// ✅ Dynamically import AFTER mocking
const EmailService = (await import('../Email.service.mjs')).default;
const { Payment_Confirmation_Validator, Admission_Confirmation_Validator } =
  await import('../Email.validator.mjs');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Payment Confirmation Email', () => {
    const validPaymentData = {
      studentName: 'John Doe',
      studentId: 'STU123',
      paymentId: 'PAY456',
      totalAmountDue: 50000,
      amountPaid: 50000,
      email: 'john.doe@example.com',
    };

    it('should send payment confirmation email successfully', async () => {
      const result =
        await EmailService.sendPaymentConfirmation(validPaymentData);
      expect(result).toBeDefined();
      expect(result.messageId).toBe('test-message-id');
    });

    it('should validate payment data correctly', () => {
      const { error } =
        Payment_Confirmation_Validator.validate(validPaymentData);
      expect(error).toBeUndefined();
    });

    it('should reject invalid payment data', () => {
      const invalidData = { ...validPaymentData, email: 'invalid-email' };
      const { error } = Payment_Confirmation_Validator.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('Admission Confirmation Email', () => {
    const validAdmissionData = {
      studentName: 'John Doe',
      studentId: 'STU123',
      email: 'john.doe@example.com',
      password: 'securePass123!',
    };

    it('should send admission confirmation email successfully', async () => {
      const result =
        await EmailService.sendAdmissionConfirmation(validAdmissionData);
      expect(result).toBeDefined();
      expect(result.messageId).toBe('test-message-id');
    });

    it('should validate admission data correctly', () => {
      const { error } =
        Admission_Confirmation_Validator.validate(validAdmissionData);
      expect(error).toBeUndefined();
    });

    it('should reject invalid admission data', () => {
      const invalidData = { ...validAdmissionData, password: '123' }; // Too short
      const { error } = Admission_Confirmation_Validator.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle email sending failures gracefully', async () => {
      // Mock a failed email send
      jest
        .spyOn(EmailService, 'sendPaymentConfirmation')
        .mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(EmailService.sendPaymentConfirmation({})).rejects.toThrow(
        'Failed to send email'
      );
    });
  });
});
