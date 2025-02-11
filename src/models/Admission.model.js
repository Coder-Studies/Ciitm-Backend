import dotenv from 'dotenv';
dotenv.config();
import { Schema, model } from 'mongoose';
import { createTransport } from '../utils/SendMail.js';
import otpGenerator from 'otp-generation';
import Course from './Create_Course.model.js';
import status from './Status.model.js';
import Student_Course from './student-course.model.js';

const AdmissionSchema = new Schema({
  uniqueId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  student: {
    firstName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },

    middleName: {
      type: String,
      trim: true,
      uppercase: true,
    },
    lastName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },
    fatherName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },
    motherName: {
      required: true,
      type: String,
      trim: true,
      uppercase: true,
    },
    email: {
      required: [true, 'Email is required'],
      type: [String, 'Email must be a string'],
      trim: true,
      lowercase: true,
      unique: [true, 'Email already exists'],
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String, // Changed to String to accommodate formats
      required: true,
      trim: true,
      match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'],
      maxlength: [10, 'Maximum number is 10 digits'],
      minlength: [10, 'Minimum number is 10 digits'],
    },

    avtar: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
    },
  },

  guardian: {
    Gname: {
      type: String,
      required: true,
    },
    Grelation: {
      type: String,
      required: true,
    },
    GcontactNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: [10, 'Maximum number is 10 digits'],
      minlength: [10, 'Minimum number is 10 digits'],
    },
  },

  address: {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
  },

  AadharCard: {
    AadharCardNumber: {
      type: String, // Changed to String to avoid issues with large numbers
      required: true,
      match: [/^\d{12}$/, 'Aadhar number must be exactly 12 digits'],
    },
  },

  tenth: {
    tenthMarks: {
      type: Number,
      required: true,
    },

    tenthBoard: {
      type: String,
      required: true,
      uppercase: true,
    },

    tenthGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E'],
    },
  },

  twelfth: {
    twelfthMarks: {
      type: Number,
      required: true,
    },

    twelfthBoard: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    twelfthGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E'],
    },
  },

  dateOfAdmission: {
    type: Date,
    default: Date.now,
  },

  course_Id: {
    type: Schema.ObjectId,
    ref: 'Student_Course',
    required: [true, 'The Course id Is Required'],
  },

  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true,
  },

  university: {
    type: String,
    required: true,
    trim: true,
  },

  fee: {
    amount_paid: {
      type: Number,
      default: 0,
    },

    late_Fine: {
      type: Number,
      default: 0,
    },

    amount_due: {
      type: Number,
      default: 0,
    },

    course_Fee: {
      type: Number,
      default: 0,
    },
  },

  status: {
    type: Schema.ObjectId,
    ref: 'Status',
  },

  admited: {
    type: Boolean,
    default: false,
  },
});

AdmissionSchema.methods.generate_id = async function (courseName) {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const uniqueId = `CIITM_${courseName}_${otp}`;
  return uniqueId;
};

AdmissionSchema.methods.createStatus = async function (Student_Id) {
  try {
    let create_new_Application_Status = await status.create({
      student_id: Student_Id,
    });

    if (!create_new_Application_Status) {
      throw new Error('Failed to Create Status');
    }

    const updatedAdmission = await this.model('Admission').findByIdAndUpdate(
      Student_Id,
      { status: create_new_Application_Status._id },
      { new: true }
    );

    if (!updatedAdmission) {
      throw new Error('Failed to Update Admission Status');
    }

    return create_new_Application_Status;
  } catch (error) {
    throw new Error(error.message || 'Failed to Create Status');
  }
};

AdmissionSchema.methods.Review_Mail = async function (data) {
  try {
    let { recipientEmail, name, uniqueId } = data;

    let MailSend_toUser = await createTransport().sendMail({
      from: `"MERN Coding School"  ${process.env.GMAIL_User}>`,
      to: `${recipientEmail}`,
      subject: 'Admission Review',

      html: `
        <h1>${name}</h1>
        <h1>Thank you for applying to MERN Coding School</h1>
        <h1>Your Application ID is ${uniqueId}</h1>
        <h1>Our Team will Review your Application and get back to you soon</h1>
        <h1>Thank you</h1>
      `,
    });

    if (!MailSend_toUser) {
      throw new Error('Email not sent');
    }
  } catch (error) {
    throw new Error(error);
  }
};

AdmissionSchema.methods.createStudentCourse = async function ({
  studentId,
  courseName,
  endDate,
  mode,
  university,
}) {
  try {
    const foundCourse = await Course.findOne({
      courseName: courseName,
    });

    console.log('Found Course:', foundCourse);
    if (!foundCourse) {
      throw new Error('Course not found');
    }

    const newStudentCourse = await Student_Course.create({
      studentId,
      endDate,

      courseName,
      mode,
      university,
      courseId: foundCourse._id.toString(),
    });

    if (!newStudentCourse) {
      throw new Error('Failed to create student course');
    }

    const updatedAdmission = await this.model('Admission').findByIdAndUpdate(
      studentId,
      {
        course_Id: newStudentCourse._id,
        'fee.courseFee': foundCourse.CPrice,
      },
      { new: true }
    );

    if (!updatedAdmission) {
      throw new Error('Failed to update admission with course');
    }

    return newStudentCourse;
  } catch (error) {
    throw new Error(error.message || 'Failed to create student course');
  }
};

AdmissionSchema.statics.findStudent = async function (uniqueId) {
  try {
    const Find_Student = await this.findOne({ uniqueId });
    if (!Find_Student) throw new Error('Student not found');
    return Find_Student;
  } catch (error) {
    throw new Error(error);
  }
};

AdmissionSchema.query.admited = function (Boolean) {
  return this.where({ admited: Boolean });
};


AdmissionSchema.pre('createCollection', async function (next) {
  try {

    const Course_detail = await Course.findOne({ _id: this.course_Id });
    this.fee.course_Fee = Course_detail.coursePrice;
    this.fee.amount_due = Course_detail.coursePrice;
    next();
  } catch (error) {
    throw new Error(error.message || 'Failed to generate unique id');
  }
});

let Admission = model('Admission', AdmissionSchema);

export default Admission;
