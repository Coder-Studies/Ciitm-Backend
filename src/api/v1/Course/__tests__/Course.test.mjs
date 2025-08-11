import { jest } from '@jest/globals';

// Mock course.model.mjs
jest.unstable_mockModule('../course.model.mjs', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock course.utils.mjs
jest.unstable_mockModule('../course.utils.mjs', () => ({
  default: {
    FindAllCourses: jest.fn(),
  },
}));

// Mock course.validator.mjs
jest.unstable_mockModule('../course.validator.mjs', () => ({
  courseValidationSchema: { validate: jest.fn() },
}));

// Import after mocks
const { default: courseService } = await import('../course.service.mjs');
const { default: courseModel } = await import('../course.model.mjs');
const courseUtils = (await import('../course.utils.mjs')).default;
const { courseValidationSchema } = await import('../course.validator.mjs');

describe('CourseService', () => {
  describe('createCourse', () => {
    it('should create a course successfully', async () => {
      courseValidationSchema.validate.mockReturnValue({ error: null });
      courseModel.findOne.mockResolvedValue(null);

      const mockCourse = { id: 1, name: 'Math', courseCode: 'MATH101' };
      courseModel.create.mockResolvedValue(mockCourse);

      const result = await courseService.createCourse(mockCourse);

      expect(result).toEqual(mockCourse);
      expect(courseModel.create).toHaveBeenCalledWith(mockCourse);
    });

    it('should throw validation error when schema fails', async () => {
      courseValidationSchema.validate.mockReturnValue({
        error: { details: [{ message: 'Invalid data' }] },
      });

      await expect(
        courseService.createCourse({ name: 'Invalid' })
      ).rejects.toThrow(/Validation error: Invalid data/);
    });

    it('should throw ALREADY_Created when course already exists', async () => {
      courseValidationSchema.validate.mockReturnValue({ error: null });
      courseModel.findOne.mockResolvedValue({ id: 1 });

      await expect(
        courseService.createCourse({ courseCode: 'MATH101' })
      ).rejects.toThrow(/Already Created/);
    });

    it('should throw wrapped error when create fails', async () => {
      courseValidationSchema.validate.mockReturnValue({ error: null });
      courseModel.findOne.mockResolvedValue(null);
      courseModel.create.mockRejectedValue(new Error('DB Error'));

      await expect(
        courseService.createCourse({ courseCode: 'MATH101' })
      ).rejects.toThrow(/Error creating course: DB Error/);
    });
  });

  describe('getAllCourses', () => {
    it('should return all courses successfully', async () => {
      const mockCourses = [
        { id: 1, name: 'Math' },
        { id: 2, name: 'Physics' },
      ];

      courseUtils.FindAllCourses.mockResolvedValue(mockCourses);

      const result = await courseService.getAllCourses();

      expect(result).toEqual(mockCourses);
    });

    it('should throw wrapped error when fetching fails', async () => {
      courseUtils.FindAllCourses.mockRejectedValue(new Error('DB Error'));

      await expect(courseService.getAllCourses()).rejects.toThrow(
        /Error fetching courses: DB Error/
      );
    });
  });
});
