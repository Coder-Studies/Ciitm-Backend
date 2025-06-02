import { 
  MOCK_STUDENTS, 
  COURSES, 
  SEMESTERS, 
  HTTP_STATUS, 
  ERROR_MESSAGES 
} from './Student.constant.mjs'; // Fixed capitalization from './student.constant.mjs'

/**
 * Get students based on course and semester
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getStudents = async (req, res) => {
  try {
    const { course, semester } = req.query;

    // Validate required parameters
    if (!course || !semester) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.MISSING_PARAMETERS,
        data: null
      });
    }

    // Validate course
    if (!Object.keys(COURSES).includes(course.toUpperCase())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_COURSE,
        data: null,
        availableCourses: Object.keys(COURSES)
      });
    }

    // Validate semester
    const semesterNum = parseInt(semester);
    if (!SEMESTERS.includes(semesterNum)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_SEMESTER,
        data: null,
        availableSemesters: SEMESTERS
      });
    }

    // Get students from mock data
    const courseStudents = MOCK_STUDENTS[course.toUpperCase()];
    const students = courseStudents?.[semesterNum] || [];

    if (students.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.NO_STUDENTS_FOUND,
        data: [],
        meta: {
          course: course.toUpperCase(),
          semester: semesterNum,
          count: 0
        }
      });
    }

    // Return successful response
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Successfully retrieved ${students.length} students`,
      data: students,
      meta: {
        course: course.toUpperCase(),
        courseName: COURSES[course.toUpperCase()],
        semester: semesterNum,
        count: students.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in getStudents controller:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error occurred while fetching students',
      data: null,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all available courses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCourses = async (req, res) => {
  try {
    const courses = Object.entries(COURSES).map(([code, name]) => ({
      code,
      name
    }));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Successfully retrieved courses',
      data: courses,
      meta: {
        count: courses.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in getCourses controller:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error occurred while fetching courses',
      data: null,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all available semesters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSemesters = async (req, res) => {
  try {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Successfully retrieved semesters',
      data: SEMESTERS,
      meta: {
        count: SEMESTERS.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in getSemesters controller:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error occurred while fetching semesters',
      data: null,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get student by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Student ID is required',
        data: null
      });
    }

    // Search for student across all courses and semesters
    let foundStudent = null;
    
    for (const course of Object.keys(MOCK_STUDENTS)) {
      for (const semester of Object.keys(MOCK_STUDENTS[course])) {
        const student = MOCK_STUDENTS[course][semester].find(s => s.id === id);
        if (student) {
          foundStudent = student;
          break;
        }
      }
      if (foundStudent) break;
    }

    if (!foundStudent) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Student not found',
        data: null
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Successfully retrieved student',
      data: foundStudent,
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in getStudentById controller:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error occurred while fetching student',
      data: null,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};