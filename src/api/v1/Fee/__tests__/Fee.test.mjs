import { jest } from '@jest/globals';

// Mock before importing the service
jest.unstable_mockModule('../../Admission/Admission.model.mjs', () => {
  return {
    __esModule: true,
    default: {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    },
  };
});

jest.unstable_mockModule('../fee.model.mjs', () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn(),
    },
  };
});

// Now import after mocks are registered
const { default: Admission } = await import(
  '../../Admission/Admission.model.mjs'
);
const { default: Fee } = await import('../fee.model.mjs');
const { default: feeService } = await import('../fee.service.mjs');

describe('Fee_Service', () => {
  describe('Update_Student_fee', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update student fee and create fee record successfully', async () => {
      const mockStudent = {
        _id: 'student123',
        fee: { amount_paid: 100, amount_due: 400 },
      };

      Admission.findOne.mockResolvedValue(mockStudent);
      Admission.findOneAndUpdate.mockResolvedValue({
        ...mockStudent,
        fee: { amount_paid: 200, amount_due: 300 },
      });
      Fee.create.mockResolvedValue({ success: true });

      const result = await feeService.Update_Student_fee({
        uniqueId: 'u123',
        Paid_amount: 100,
        totalFee: 500,
        paymentId: 'p001',
        paymentMethod: 'Card',
      });

      expect(Admission.findOne).toHaveBeenCalledWith({ uniqueId: 'u123' });
      expect(Admission.findOneAndUpdate).toHaveBeenCalled();
      expect(Fee.create).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should throw error if student is not found', async () => {
      Admission.findOne.mockResolvedValue(null);

      await expect(
        feeService.Update_Student_fee({
          uniqueId: 'u999',
          Paid_amount: 100,
          totalFee: 500,
        })
      ).rejects.toThrow('Student not found');
    });

    it('should throw error if fee update fails', async () => {
      const mockStudent = { _id: 'student123', fee: { amount_paid: 100 } };
      Admission.findOne.mockResolvedValue(mockStudent);
      Admission.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        feeService.Update_Student_fee({
          uniqueId: 'u123',
          Paid_amount: 100,
          totalFee: 500,
        })
      ).rejects.toThrow('Failed to update fee for the student');
    });

    it('should throw error if fee creation fails', async () => {
      const mockStudent = {
        _id: 'student123',
        fee: { amount_paid: 100, amount_due: 400 },
      };
      Admission.findOne.mockResolvedValue(mockStudent);
      Admission.findOneAndUpdate.mockResolvedValue({
        ...mockStudent,
        fee: { amount_paid: 200, amount_due: 300 },
      });
      Fee.create.mockRejectedValue(new Error('Fee creation failed'));

      await expect(
        feeService.Update_Student_fee({
          uniqueId: 'u123',
          Paid_amount: 100,
          totalFee: 500,
          paymentMethod: 'Card',
        })
      ).rejects.toThrow('Fee creation failed');
    });
  });
});
