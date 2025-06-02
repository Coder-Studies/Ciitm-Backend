const STUDENT_Constant = {
  STUDENT_NOT_FOUND: 'Student Not Found',
  STUDENT_ALREADY_EXIST: 'Student Already Exist',
  STUDENT_CREATED: 'Student Created',
  STUDENT_NOT_CREATED: 'Student Not Created',
  STUDENT_UPDATED: 'Student Updated',
  STUDENT_NOT_UPDATED: 'Student Not Updated',
  STUDENT_DELETED: 'Student Deleted',
  STUDENT_NOT_DELETED: 'Student Not Deleted',
  STUDENT_FOUND: 'Student Found',
};

export default Object.freeze(STUDENT_Constant);

// Student events
export const STUDENT_EVENTS = {
  GET_STUDENTS: 'get-students',
  STUDENTS_DATA: 'students-data',
  STUDENT_ERROR: 'student-error'
};

// Courses
export const COURSES = {
  CSE: 'Computer Science Engineering',
  ECE: 'Electronics and Communication Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
  EE: 'Electrical Engineering',
  IT: 'Information Technology'
};

// Semesters
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Mock student data
export const MOCK_STUDENTS = {
  CSE: {
    1: [
      {
        id: 'CSE001',
        name: 'Arun Kumar',
        rollNumber: 'CSE2024001',
        email: 'arun.kumar@student.edu',
        phone: '+91-9876543210',
        course: 'CSE',
        semester: 1,
        cgpa: 8.5,
        attendance: 92,
        dateOfBirth: '2005-03-15',
        address: 'Delhi, India',
        guardianName: 'Rajesh Kumar',
        guardianPhone: '+91-9876543211'
      },
      {
        id: 'CSE002',
        name: 'Priya Sharma',
        rollNumber: 'CSE2024002',
        email: 'priya.sharma@student.edu',
        phone: '+91-9876543212',
        course: 'CSE',
        semester: 1,
        cgpa: 9.1,
        attendance: 95,
        dateOfBirth: '2005-07-22',
        address: 'Mumbai, India',
        guardianName: 'Suresh Sharma',
        guardianPhone: '+91-9876543213'
      },
      {
        id: 'CSE003',
        name: 'Rahul Singh',
        rollNumber: 'CSE2024003',
        email: 'rahul.singh@student.edu',
        phone: '+91-9876543214',
        course: 'CSE',
        semester: 1,
        cgpa: 7.8,
        attendance: 88,
        dateOfBirth: '2005-01-10',
        address: 'Bangalore, India',
        guardianName: 'Mohan Singh',
        guardianPhone: '+91-9876543215'
      }
    ],
    2: [
      {
        id: 'CSE004',
        name: 'Sneha Patel',
        rollNumber: 'CSE2023001',
        email: 'sneha.patel@student.edu',
        phone: '+91-9876543216',
        course: 'CSE',
        semester: 2,
        cgpa: 8.9,
        attendance: 94,
        dateOfBirth: '2004-11-05',
        address: 'Ahmedabad, India',
        guardianName: 'Kiran Patel',
        guardianPhone: '+91-9876543217'
      },
      {
        id: 'CSE005',
        name: 'Vikash Gupta',
        rollNumber: 'CSE2023002',
        email: 'vikash.gupta@student.edu',
        phone: '+91-9876543218',
        course: 'CSE',
        semester: 2,
        cgpa: 8.2,
        attendance: 90,
        dateOfBirth: '2004-08-18',
        address: 'Kolkata, India',
        guardianName: 'Ramesh Gupta',
        guardianPhone: '+91-9876543219'
      }
    ]
  },
  ECE: {
    1: [
      {
        id: 'ECE001',
        name: 'Anjali Reddy',
        rollNumber: 'ECE2024001',
        email: 'anjali.reddy@student.edu',
        phone: '+91-9876543220',
        course: 'ECE',
        semester: 1,
        cgpa: 8.7,
        attendance: 91,
        dateOfBirth: '2005-05-12',
        address: 'Hyderabad, India',
        guardianName: 'Ravi Reddy',
        guardianPhone: '+91-9876543221'
      },
      {
        id: 'ECE002',
        name: 'Karan Mehta',
        rollNumber: 'ECE2024002',
        email: 'karan.mehta@student.edu',
        phone: '+91-9876543222',
        course: 'ECE',
        semester: 1,
        cgpa: 7.9,
        attendance: 87,
        dateOfBirth: '2005-02-28',
        address: 'Pune, India',
        guardianName: 'Ashok Mehta',
        guardianPhone: '+91-9876543223'
      }
    ],
    2: [
      {
        id: 'ECE003',
        name: 'Deepika Jain',
        rollNumber: 'ECE2023001',
        email: 'deepika.jain@student.edu',
        phone: '+91-9876543224',
        course: 'ECE',
        semester: 2,
        cgpa: 9.0,
        attendance: 96,
        dateOfBirth: '2004-09-14',
        address: 'Jaipur, India',
        guardianName: 'Prakash Jain',
        guardianPhone: '+91-9876543225'
      }
    ]
  },
  ME: {
    1: [
      {
        id: 'ME001',
        name: 'Rohit Verma',
        rollNumber: 'ME2024001',
        email: 'rohit.verma@student.edu',
        phone: '+91-9876543226',
        course: 'ME',
        semester: 1,
        cgpa: 8.3,
        attendance: 89,
        dateOfBirth: '2005-04-20',
        address: 'Lucknow, India',
        guardianName: 'Vinod Verma',
        guardianPhone: '+91-9876543227'
      }
    ]
  },
  CE: {
    1: [
      {
        id: 'CE001',
        name: 'Pooja Agarwal',
        rollNumber: 'CE2024001',
        email: 'pooja.agarwal@student.edu',
        phone: '+91-9876543228',
        course: 'CE',
        semester: 1,
        cgpa: 8.6,
        attendance: 93,
        dateOfBirth: '2005-06-08',
        address: 'Indore, India',
        guardianName: 'Manoj Agarwal',
        guardianPhone: '+91-9876543229'
      }
    ]
  },
  EE: {
    1: [
      {
        id: 'EE001',
        name: 'Amit Yadav',
        rollNumber: 'EE2024001',
        email: 'amit.yadav@student.edu',
        phone: '+91-9876543230',
        course: 'EE',
        semester: 1,
        cgpa: 7.5,
        attendance: 85,
        dateOfBirth: '2005-12-03',
        address: 'Patna, India',
        guardianName: 'Sunil Yadav',
        guardianPhone: '+91-9876543231'
      }
    ]
  },
  IT: {
    1: [
      {
        id: 'IT001',
        name: 'Neha Soni',
        rollNumber: 'IT2024001',
        email: 'neha.soni@student.edu',
        phone: '+91-9876543232',
        course: 'IT',
        semester: 1,
        cgpa: 8.8,
        attendance: 97,
        dateOfBirth: '2005-10-16',
        address: 'Chandigarh, India',
        guardianName: 'Rajiv Soni',
        guardianPhone: '+91-9876543233'
      }
    ]
  }
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Error messages for student module
 * @constant
 */
export const ERROR_MESSAGES = {
  MISSING_PARAMETERS: 'Course and semester parameters are required',
  INVALID_COURSE: 'Invalid course code provided',
  INVALID_SEMESTER: 'Invalid semester number provided',
  NO_STUDENTS_FOUND: 'No students found for the specified course and semester',
  STUDENT_NOT_FOUND: 'Student not found',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred'
};
