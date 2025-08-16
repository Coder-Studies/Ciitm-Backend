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

  async deleteTeacherByID(id) {
    // Find and delete the teacher by ID
    const deletedTeacher = await TeacherSchema.findByIdAndDelete(id);
    return deletedTeacher;
  }

  async updateTeacherByID(id, updateData) {
    // Only update allowed fields
    const allowedFields = [
      'name',
      'email',
      'imageUrl',
      'role',
      'Specialization',
      'Experience',
      'social_media'
    ];
    const filteredData = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    }

    // Find and update teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true }
    );
    return updatedTeacher;
  }
}

export default new TeacherService();
