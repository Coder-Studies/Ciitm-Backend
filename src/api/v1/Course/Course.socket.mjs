import courseUtils from './course.utils.mjs';

let Course_Socket = async (io, socket) => {
  socket.on('FindCourse', async () => {
    try {
      const course = await courseUtils.FindAllCoursesName();
      if (!course) {
        throw new Error('Course not found');
      }
      socket.emit('CourseFound', course);
    } catch (error) {
      socket.emit('Error', error.message);
    }
  });
};

export default Course_Socket;
