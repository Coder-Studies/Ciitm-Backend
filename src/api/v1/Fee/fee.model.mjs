import mongoose from 'mongoose';

const { Schema } = mongoose;

const feeSchema = new Schema(
  {
    uniqueId: {
      type: String,
      trim: true,
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentAuthentication',
      required: true,
    },

    PaymentId: {
      type: String,
      trim: true,
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
      default: 0, // Computed below in pre-save
    },

    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    PaymentType: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },

    paymentMethod: {
      type: String,
      enum: ['Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card Payment'],
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate dueFee before saving
feeSchema.pre('save', function (next) {
  this.dueFee = Math.max(0, this.totalFee - this.amountPaid - this.discount);

  next();
});

// If needed, you can define custom instance methods here
// Example: feeSchema.methods.getSummary = function () { ... }

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;
