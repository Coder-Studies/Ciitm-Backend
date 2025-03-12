import mongoose from 'mongoose';
import { Update_Student_fee } from '../Service/student.service.js';
import Admission from './Admission.model.js';

const { Schema } = mongoose;

const feeSchema = new Schema(
  {
    Unique_id: {
      type: String,
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentAuthentication', 
    },

    PaymentId: {
      type: String,
      required: true,
      unique: true,
    },

    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    dueFee: {
      type: Number,
      required: true,
      default: function () {
        return Math.max(0, this.totalFee - this.amountPaid - this.discount);
      },
    },

    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'bank_transfer', 'online_payment'],
      required: true,
    },
  },
  { timestamps: true }
);

feeSchema.pre('save', async function (next) {
  try {






   let find_Student = Admission.findOne({uniqueId: this.Unique_id});

   if(!find_Student){
      throw new Error('Failed to Find Student');
  }
  
  this.studentId = find_Student._id;


  let Update_fee = await Update_Student_fee({
    uniqueId: this.Unique_id,
    Paid_amount: this.amountPaid,
  });


  if(find_Student && Update_fee.acknowledged === true){
    next();
  } else {
    throw new Error('Failed to Update Fee');
  }

  } catch (error) {
    throw new Error(error.message || 'Failed to Find Course');
  }
});
feeSchema.methods.find_Fee = async function (feeId) {
  let find_fee = await course.findById(feeId);
  return find_fee.CPrice;
};

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;
