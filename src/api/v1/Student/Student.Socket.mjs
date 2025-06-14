import SendResponse from "../../../utils/SendResponse.mjs";
import { response } from "express";
import Admission from "../Admission/Admission.model.mjs";
import AdmissionUtils from "../Admission/Admission.utils.mjs";
import StudentUtils from "./Student.utils.mjs";


const SocketToFindStudentById = (io, socket) => {
  socket.on('findStudentById', async ({studentId}) => {
    try {
      console.log('Socket to find student by ID:', studentId);
      const student = await StudentUtils.FindByStudentId(studentId);
      console.log('Found student:', student);
      if (!student) {
        throw new Error('Student not found');
      }
      socket.emit('studentFound', student);
    } catch (error) {
      console.error('Error finding student:', error);
      socket.emit('error', { message: 'Error finding student', error: error.message });
    }
  });
}

const StudentSocket = (io, socket) => {
    console.log('Student Socket connected:', socket.id);
   SocketToFindStudentById(io, socket);
}
export default StudentSocket;