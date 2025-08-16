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

  async deleteTeacherByID(req, res) {
    try {
      const { id } = req.params;

      const deletedTeacher = await TeacherService.deleteTeacherByID(id);

      if (!deletedTeacher) {
        throw new Error(TeacherConstant.Teacher_NotFound);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        TeacherConstant.TeacherDeleted,
        deletedTeacher
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || TeacherConstant.Teacher_NotDeleted
      );
    }
  }

  async updateTeacherByID(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Optionally handle image upload if a new image is provided
      if (req.file && req.file.filename) {
        const Cloudinary = await uploadOnCloudinary({
          file: req.file.filename,
          folder: 'Teachers',
        });
        if (!Cloudinary) {
          throw new Error(TeacherConstant.Image_NotUploaded);
        }
        updateData.imageUrl = Cloudinary.url;
      }

      // Validate update data (implement validation logic as needed)
      const validatedData = await TeacherService.validateTeacherData(updateData);

      // Update teacher in DB
      const updatedTeacher = await TeacherService.updateTeacherByID(id, validatedData);

      if (!updatedTeacher) {
        return SendResponse.error(
          res,
          StatusCodeConstant.NOT_FOUND,
          TeacherConstant.Teacher_NotFound
        );
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        TeacherConstant.TeacherUpdate,
        updatedTeacher
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.BAD_REQUEST,
        error.message || TeacherConstant.Teacher_NotUpdated
      );
    }
  }
}

export default new Teacher_Controller();
