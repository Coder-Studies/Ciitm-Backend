import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import TeacherConstant from './Teacher.constant.mjs';
import TeacherService from './Teacher.service.mjs';
import Teacher_validation from './Teacher.validator.mjs';

class Teacher_Controller {
  async createNewTeacher(req, res) {
    try {
      const { filename } = req.file;

      let Cloudinary = await uploadOnCloudinary({
        file: filename,
        folder: 'Teachers',
      });

      if (!Cloudinary) {
        throw new Error(TeacherConstant.Image_NotUploaded);
      }

      let validatedData = await TeacherService.validateTeacherData(req.body);

      let CreateTeacher = await TeacherService.createTeacher({
        teacherData: req.body,
        imageUrl: Cloudinary.url,
      });

      if (!CreateTeacher) {
        throw new Error(TeacherConstant.Teacher_NotCreated);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        TeacherConstant.TeacherCreated,
        CreateTeacher
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || TeacherConstant.Teacher_NotCreated
      );
    }
  }

  async FindAllTeachers(req, res) {
    try {
      let FindAllTeachers = await TeacherService.FindAllTeachers();

      if (FindAllTeachers.length === 0) {
        throw new Error(TeacherConstant.Teacher_NotFound);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        TeacherConstant.Find_Teacher,
        FindAllTeachers
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || TeacherConstant.Teacher_NotFound
      );
    }
  }
}

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate required fields if needed
    const allowedUpdates = ['name', 'email', 'subject', 'department', 'phone', 'qualification'];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates'
      });
    }

    const teacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating teacher',
      error: error.message
    });
  }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
      data: teacher
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message
    });
  }
};
module.exports = {updateTeacher,deleteTeacher};

export default new Teacher_Controller();
