// src/api/v1/Contact/__tests__/Contact.test.mjs
import { jest } from '@jest/globals';

// 1️⃣ Mock Contact model
jest.unstable_mockModule('../Contace.model.mjs', () => ({
  default: {
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// 2️⃣ Mock constants
jest.unstable_mockModule('../Contact.constant.mjs', () => ({
  default: {
    NOT_CREATED: 'Contact Form Not Created Successfully',
    NOT_FOUND: 'Contact Form Not Found',
  },
}));

// 3️⃣ Import after mocks
const Contact = (await import('../Contace.model.mjs')).default;
const ContactConstant = (await import('../Contact.constant.mjs')).default;
const ContactService = (await import('../Contact.service.mjs')).default;

describe('ContactService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // createContact
  // =========================
  describe('createContact', () => {
    it('should create a contact successfully', async () => {
      const mockContact = { id: '1', name: 'John Doe' };
      Contact.create.mockResolvedValue(mockContact);

      const result = await ContactService.createContact({ name: 'John Doe' });

      expect(result).toEqual(mockContact);
      expect(Contact.create).toHaveBeenCalledWith({ name: 'John Doe' });
    });

    it('should throw NOT_CREATED when creation returns null', async () => {
      Contact.create.mockResolvedValue(null);

      await expect(
        ContactService.createContact({ name: 'John Doe' })
      ).rejects.toThrow(ContactConstant.NOT_CREATED);
    });

    it('should throw custom error when Contact.create throws', async () => {
      Contact.create.mockRejectedValue(new Error('DB error'));

      await expect(
        ContactService.createContact({ name: 'John Doe' })
      ).rejects.toThrow('DB error');
    });
  });

  // =========================
  // deleteContact
  // =========================
  describe('deleteContact', () => {
    it('should delete a contact successfully', async () => {
      const mockDeleted = { id: '1', name: 'John Doe' };
      Contact.findByIdAndDelete.mockResolvedValue(mockDeleted);

      const result = await ContactService.deleteContact('1');

      expect(result).toEqual(mockDeleted);
      expect(Contact.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NOT_FOUND when deletion returns null', async () => {
      Contact.findByIdAndDelete.mockResolvedValue(null);

      await expect(ContactService.deleteContact('1')).rejects.toThrow(
        ContactConstant.NOT_FOUND
      );
    });

    it('should throw custom error when Contact.findByIdAndDelete throws', async () => {
      Contact.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

      await expect(ContactService.deleteContact('1')).rejects.toThrow(
        'DB error'
      );
    });
  });
});
