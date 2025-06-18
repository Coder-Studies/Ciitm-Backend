import { model, Schema } from 'mongoose';

let Course_Schema = new Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },

  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },

  courseDuration: {
    type: String,
    required: true,
    trim: true,
  },

  courseEligibility: {
    type: String,
    required: true,
    trim: true,
  },

  courseThumbnail: {
    type: String,
    required: true,
    trim: true,
  },

  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },

  coursePrice: {
    type: Number,
    required: true,
  },
});

export default model('Course', Course_Schema);
