import { Schema, model } from 'mongoose';

const Student_course_Schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentAuthentication',
      required: true,
    },

    courseId: {
      type: Schema.ObjectId,
      ref: 'Course',
      required: true,
    },

    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      required: true,
    },

    university: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
      default: new Date(),
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Student_Course = model('Student_Course', Student_course_Schema);

export default Student_Course;
