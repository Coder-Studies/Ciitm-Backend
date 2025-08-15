import TeacherConstant from './Teacher.constant.mjs';
import TeacherSchema from './Teacher.model.mjs';
import TeacherUtils from './Teacher.utils.mjs';
import Teacher_validation from './Teacher.validator.mjs';

class TeacherService {
  createTeacher({ teacherData, imageUrl }) {
    try {
      let CreateTeacher = TeacherSchema.create({
        name: teacherData.name,
        email: teacherData.email,
        image: imageUrl,
        role: teacherData.role,
        Specialization: teacherData.Specialization,
        Experience: teacherData.Experience,
        social_media: [
          {
            facebook: teacherData.facebook,
            linkedin: teacherData.linkedin,
            twitter: teacherData.twitter,
            instagram: teacherData.instagram,
          },
        ],
      });
      if (!CreateTeacher) {
        throw new Error(TeacherConstant.Teacher_NotCreated);
      }

      return CreateTeacher;
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotCreated);
    }
  }

  FindAllTeachers() {
    try {
      let FindAllTeachers = TeacherUtils.FindAllTeachers();
      if (!FindAllTeachers) {
        throw new Error(TeacherConstant.Teacher_NotFound);
      }
      return FindAllTeachers;
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotFound);
    }
  }

  validateTeacherData(teacherData) {
    const { error } = Teacher_validation.validate({
      name: teacherData.name,
      email: teacherData.email,
      role: teacherData.role,
      Specialization: teacherData.Specialization,
      Experience: teacherData.Experience,
      instagram: teacherData.instagram,
      facebook: teacherData.facebook,
      linkedin: teacherData.linkedin,
      twitter: teacherData.twitter,
    });
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
  deleteTeacher(teacherId) {

    try {
      if (!teacherId) {
      throw new Error(TeacherConstant.Teacher_IdRequired);
      }
    return TeacherUtils.deleteTeacher(teacherId);
    } catch (error) {
      throw new Error(error.message || TeacherConstant.Teacher_NotDeleted);
     }


    
  }


  updateTeacherById(teacherId, teacherData) {
    try {
      if (!teacherId) {
        throw new Error(TeacherConstant.Teacher_IdRequired);
      }
      // this.validateTeacherData(teacherData);
return TeacherUtils.updateTeacher(teacherId, teacherData);
    } catch (error) {
    throw new Error(error.message || TeacherConstant.TeacherUpdate);
    }
  }




}

export default new TeacherService();
