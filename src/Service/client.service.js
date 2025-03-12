import Testimonial_Schema from '../models/Testimonials.model.js';
import course_Schema from '../models/Create_Course.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import Admission from '../models/Admission.model.js';
import Student_Course from '../models/student-course.model.js';

export let find_Course = async (courseName) => {
  try {
    let course = course_Schema.findOne({ courseName: courseName });

    if (!course) {
      return { status: 404, message: 'Course not found', found: false };
    }
    return course;
  } catch (error) {
    throw new Error(error.message || 'Failed to Find Course');
  }
};

export let find_Course_by_studentId = async ({ id }) => {
  try {
    let find_Student_Course = await Student_Course.findOne({
      studentId: id,
    }).populate('courseId');

    if (!find_Student_Course) {
      throw new Error('Student Course not found');
    }

    return find_Student_Course.courseId;
  } catch (error) {
    console.error('Error:', error.message);
    return {
      status: 500,
      message: error.message || 'Failed to find course',
      found: false,
    };
  }
};

export let Create_Testimonial = async ({ data, file }) => {
  try {
    let { filename } = file;

    let Cloudinary = await uploadOnCloudinary(filename);

    let Created_Testimonial = await Testimonial_Schema.create({
      name: data.name,
      email: data.email,
      image: Cloudinary.url,
      message: data.message,
      job_Role: data.job_Role,
      star: data.star,
    });

    if (!Create_Testimonial) {
      throw new Error('Failed to Create Testimonial');
    }

    return Created_Testimonial;
  } catch (error) {
    throw new Error(error.message || 'Failed to Find Course');
  }
};

export let Find_Student = async () => {};

export let Create_Contact = async () => {};
