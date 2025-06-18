import SendResponse from '../../../utils/SendResponse.mjs';
import { response } from 'express';
import Admission from '../Admission/Admission.model.mjs';
import AdmissionUtils from '../Admission/Admission.utils.mjs';
import StudentUtils from './Student.utils.mjs';
import StudentConstant from './Student.constant.mjs';

const SocketToFindStudentById = (io, socket) => {
  socket.on('findStudentById', async ({ studentId }) => {
    try {
      const student = await StudentUtils.FindByStudentId(studentId);

      if (!student) {
        throw new Error(StudentConstant.STUDENT_NOT_FOUND);
      }
      socket.emit('studentFound', student);
    } catch (error) {
      console.error('Error finding student:', error);
      socket.emit('error', { message: error.message });
    }
  });
};

const StudentSocket = (io, socket) => {
  SocketToFindStudentById(io, socket);
};
export default StudentSocket;
