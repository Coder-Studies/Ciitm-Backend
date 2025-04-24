import { Schema, model } from 'mongoose';

let student_Admission_Status = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Admission',
    require: true,
  },

  message: {
    type: String,
    default: 'Your application is being processed',
    min: [5, 'min 5 characters is Required'],
    max: [100, 'max 100 characters is Required'],
    required: true,
  },

  applicationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Approved', 'Rejected'],
    default: 'Pending',
  },
});

let status = model('status', student_Admission_Status);
export default status;
