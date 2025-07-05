import mongoose from 'mongoose';


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
      enum: ['Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card Payment'],
      required: true,
    },
  },
  { timestamps: true }
);


feeSchema.methods.find_Fee = async function (feeId) {
  let find_fee = await course.findById(feeId);
  return find_fee.CPrice;
};

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;
