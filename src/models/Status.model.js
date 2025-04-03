// import Admission from './Admission.model.js';
// import { Schema, model } from 'mongoose';

// let student_Admission_Status = new Schema({
//   student_id: {
//     type: Schema.Types.ObjectId,
//     ref: 'Admission',
//     require: true,
//   },

//   message: {
//     type: String,
//     default: 'Your application is being processed',
//     min: [5, 'min 5 characters is Required'],
//     max: [100, 'max 100 characters is Required'],
//     required: true,
//   },

//   applicationStatus: {
//     type: String,
//     enum: ['Pending', 'Verified', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
// });

// student_Admission_Status.statics.Find_status = async function (uniqueId) {
//   try {
//     let findStudent = await Admission.findOne({ uniqueId: uniqueId });

//     if (!findStudent) {
//       throw Error('Student not found');
//     }

//     let findStatus = await this.findOne({
//       student_id: findStudent._id.toString(),
//     });

//     if (!findStatus) {
//       throw new Error('Status not found');
//     }

//     let data = {
//       findStudent: findStudent.student,
//       status: findStatus,
//     };

//     return data;
//   } catch (error) {
//     throw new Error(error.message || 'Status Not Found');
//   }
// };

// let status = model('status', student_Admission_Status);
// export default status;
