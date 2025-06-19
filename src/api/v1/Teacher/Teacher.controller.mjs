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
}

export default new Teacher_Controller();
