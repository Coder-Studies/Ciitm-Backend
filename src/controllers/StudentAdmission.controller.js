import crypto from 'crypto';
import { create_Student, Sign_Up_Student } from '../Service/student.service.js';
import StudentSchema from '../models/Admission.model.js';
import AdmissionSchema from '../models/Admission.model.js';
import Create_CourseModel from '../models/Create_Course.model.js';
import env from 'dotenv';
import AdmissionValidationSchema from '../validation/AdmissionSchema.Joi.js';
import status from '../models/Status.model.js';
import { Update_Status } from '../Service/admin.service.js';
import Update_Status_template from '../template/email/update.template.js';
import { STUDENT_Constant } from '../constant/Student .constant.js';
import Update_Status_Validation from '../validation/Update_Status_Validation.js';
import { COURSE_Constant } from '../constant/Course.constant.js';
import AuthenticationSchema from '../models/AuthenticationSchema.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import multer from 'multer';
env.config({
  path: '../../.env',
});

export const Handle_newStudent_Record = async (req, res) => {
  try {
    const data = req.body;


    const { filename } = req.file;
    console.log('File:', filename);

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        error: true,
      });
    }




    let Cloudinary = await uploadOnCloudinary(filename);

    if (Cloudinary.error) {
      return res.status(400).json({
        message: 'Failed to Upload Image',
        error: true,
      });
    }

    let { courseName } = req.body;

    const admissionInstance = new AdmissionSchema();

    const uniqueId = await admissionInstance.generate_id(courseName);

    let { error } = await AdmissionValidationSchema.validate(data);

    if (error) {
      throw new Error(error.message);
    }

    const find_course = await Create_CourseModel.findOne({
      courseName: data.courseName,
    });

    let find_student = await AdmissionSchema.findOne({
      'student.email': data.email,
    });

    if (find_student) {
      return res.status(200).json({
        message: STUDENT_Constant.STUDENT_ALREADY_ADMITTED,
        error: true,
      });
    }

    if (!find_course) {
      return res
        .status(404)
        .json({ message: COURSE_Constant.NOT_FOUND, not_found: true });
    }

    let Admission = await create_Student({
      data: data,
      course: find_course,
      uniqueId: uniqueId,
      image_Url: Cloudinary.url,
    });

    if (!Admission) {
      return res.status(400).json({
        message: STUDENT_Constant.FAIL_TO_CREATE_STUDENT,
        error: true,
      });
    }

    await admissionInstance.createStatus(Admission._id);

    await admissionInstance.createStudentCourse({
      studentId: Admission._id,
      courseName: req.body.courseName,
      endDate: new Date().getFullYear() + 3,
      mode: req.body.mode,
      university: req.body.university,
    });

    await admissionInstance.Review_Mail({
      recipientEmail: data.email,
      name: data.firstName + '' + data.lastName,
      uniqueId,
    });

    return res.status(200).json({
      new_Addmission: Admission,
      message: STUDENT_Constant.STUDENT_CREATED,

      created: true,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(error.status || 500).json({
      message: error.message || STUDENT_Constant.FAIL_TO_CREATE_STUDENT,
      error: true,
    });
  }
};

export const Find_Student_Controller = async (req, res) => {
  try {
    let find_student = await StudentSchema.find().admited(false);

    find_student = find_student.map((student) => {
      return {
        student: {
          _id: student._id,
          firstName: student.student.firstName,
          lastName: student.student.lastName,
          phone: student.student.phone,
          uniqueId: student.uniqueId,
          course: student.uniqueId.split('/')[1],
        },
      };
    });

    if (!find_student) {
      return res.status(404).json({
        message: STUDENT_Constant.FAILED_TO_FIND_STUDENT,
        not_found: true,
      });
    }

    return res.status(200).json({
      student: find_student,
      message: STUDENT_Constant.STUDENT_FOUND,
      success: true,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || STUDENT_Constant.FAILED_TO_FIND_STUDENT,
      error: true,
    });
  }
};

export const Find_Student_Status_Controller = async (req, res) => {
  try {
    let { uniqueId } = req.params;

    let find_Status = await status.Find_status(uniqueId);

    if (find_Status) {
      res.status(200).json({
        data: find_Status,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || STUDENT_Constant.STATUS_NOT_FOUND,
      error: true,
    });
  }
};

export const Update_Student_Status_Controller = async (req, res) => {
  try {
    let { uniqueId } = req.params;
    let find_Student = await StudentSchema.findOne({ uniqueId: uniqueId });
    let find_User = await AuthenticationSchema.findOne({
      email: find_Student.student.email[0],
    });

    if (find_User) {
      return res.status(200).json({
        error: true,
        message: STUDENT_Constant.ALREADY_REGISTER,
      });
    }

    let Authentication_Instance = new AuthenticationSchema();

    if (!find_Student) {
      return res.status(200).json({
        message: STUDENT_Constant.STUDENT_NOT_FOUND,
      });
    }

    let { message, applicationStatus } = req.body;

    let validate = Update_Status_Validation.validate({
      message,
      applicationStatus,
    });

    if (validate.error) {
      throw new Error(validate.error.message);
    }

    let Updated_Student_Status = await Update_Status({
      uniqueId: uniqueId,
      message: message,
      applicationStatus: applicationStatus,
    });

    if (!Updated_Student_Status) {
      return res.status(400).json({
        message: STUDENT_Constant.STATUS_NOT_UPDATED,
        error: true,
      });
    }

    if (applicationStatus !== 'Approved') {
      let send_Update_mail = await Update_Status_template({
        firstName: find_Student.student.firstName,
        lastName: find_Student.student.lastName,
        message: message,
        uniqueId: uniqueId,
        email: find_Student.student.email[0],
      });

      if (!send_Update_mail) {
        return res.status(400).json({
          message: STUDENT_Constant.NOT_MAIL_SEND,
          error: true,
        });
      }
    }

    let password = crypto.randomBytes(5).toString('hex');

    let HashPassword = await Authentication_Instance.hashPassword(password);

    if (!HashPassword) {
      return res.status(400).json({
        message: 'Failed to Hash Password',
        error: true,
      });
    }

    let Sign_Up_new_Student = await Sign_Up_Student({
      name:
        find_Student.student.firstName + ' ' + find_Student.student.lastName,
      email: find_Student.student.email[0],
      orignal_password: password,
      password: HashPassword,
    });

    if (!Sign_Up_new_Student) {
      return res.status(400).json({
        message: 'Failed to Sign Up New Student',
        error: true,
      });
    }

    res.status(200).json({
      message: STUDENT_Constant.STATUS_UPDATED,
      status: Updated_Student_Status,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(error.status || 500).json({
      message: error.message || STUDENT_Constant.STATUS_NOT_UPDATED,
      error: true,
    });
  }
};

