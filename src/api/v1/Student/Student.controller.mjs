import StatusCodeConstant from "../../../constant/StatusCode.constant.mjs";
import SendResponse from "../../../utils/SendResponse.mjs";
import StudentConstant from "./Student.constant.mjs";
import StudentUtils from "./Student.utils.mjs";

class Student_Controller {
   async FindByCourseAndSemester(req, res) {
        try {
            const { course, semester } = req.query;
            

            if (!course || !semester) {
                throw new Error('Course and semester are required parameters');
            }

            const students = await StudentUtils.FindStudentBySemesterAndCourse(course, semester);

            if (students.length === 0) {
                throw new Error(StudentConstant.STUDENT_NOT_FOUND);
            }

            SendResponse.success(
                res,
                StatusCodeConstant.SUCCESS,
                'Students found successfully',
                students
            );
         
        } catch (error) {
          SendResponse.error(
            res,
            StatusCodeConstant.INTERNAL_SERVER_ERROR,
            error.message || 'Error fetching students by course and semester'
          );
        }
    }
}


export default new Student_Controller();