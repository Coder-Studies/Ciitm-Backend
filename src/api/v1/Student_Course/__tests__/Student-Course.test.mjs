import { jest } from '@jest/globals';

// 1️⃣ Mock the model before importing the service
const mockCreate = jest.fn();
jest.unstable_mockModule('../Student-Course.model.mjs', () => ({
  default: { create: mockCreate },
}));

// 2️⃣ Import constants and service after mocks
const { default: StudentCourseConstant } = await import(
  '../Student-Course.constant.mjs'
);
const { default: studentCourseService } = await import(
  '../Student-Course.service.mjs'
);

describe('Student_Course_Service', () => {
  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a student course successfully', async () => {
      const mockCourse = { _id: 'course123', studentId: 'student123' };
      mockCreate.mockResolvedValue(mockCourse);

      const result = await studentCourseService.create({
        studentId: 'student123',
        courseId: 'course123',
        mode: 'online',
        university: 'Test Uni',
        endDate: '2025-12-31',
      });

      expect(mockCreate).toHaveBeenCalledWith({
        studentId: 'student123',
        courseId: 'course123',
        mode: 'online',
        university: 'Test Uni',
        endDate: '2025-12-31',
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw STUDENT_COURSE_NOT_CREATED if create returns null', async () => {
      mockCreate.mockResolvedValue(null);

      await expect(
        studentCourseService.create({
          studentId: 'student123',
          courseId: 'course123',
          mode: 'online',
          university: 'Test Uni',
          endDate: '2025-12-31',
        })
      ).rejects.toThrow(StudentCourseConstant.STUDENT_COURSE_NOT_CREATED);
    });

    it('should throw error if create throws', async () => {
      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(
        studentCourseService.create({
          studentId: 'student123',
          courseId: 'course123',
          mode: 'online',
          university: 'Test Uni',
          endDate: '2025-12-31',
        })
      ).rejects.toThrow('DB Error');
    });
  });
});
