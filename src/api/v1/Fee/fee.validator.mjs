import Joi from 'joi';

// Unique_id: {
//   type: String,
//   required: true,
// },

// studentId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'StudentAuthentication',
// },

// PaymentId: {
//   type: String,
//   required: true,
//   unique: true,
// },

// amountPaid: {
//   type: Number,
//   required: true,
//   default: 0,
// },

// discount: {
//   type: Number,
//   default: 0,
// },

// totalFee: {
//   type: Number,
//   required: true,
//   min: 0,
// },

// dueFee: {
//   type: Number,
//   required: true,
//   default: function () {
//     return Math.max(0, this.totalFee - this.amountPaid - this.discount);
//   },
// },

// paymentDate: {
//   type: Date,
//   default: Date.now,
//   required: true,
// },

// paymentMethod: {
//   type: String,
//   enum: ['cash', 'credit_card', 'bank_transfer', 'online_payment'],
//   required: true,
// },

export let UpdateFee_Validator = Joi.object({
  uniqueId: Joi.string().required().messages({
    'string.empty': 'Unique ID is required',
    'any.required': 'Unique ID is required',
  }),
  Student_id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
    'any.required': 'Student ID is required',
  }),
  paymentMethod: Joi.string()
    .valid('Cash', 'Cheque', 'Online Transfer', 'UPI', 'Card Payment')
    .required()
    .messages({
      'string.empty': 'Payment method is required',
      'any.required': 'Payment method is required',
      'any.only':
        "Payment method must be one of 'Cash', 'Cheque', 'Online Transfer', 'UPI', or 'Card Payment'",
    }),

  totalFee: Joi.number().required().messages({
    'number.base': 'Total fee must be a number',
    'any.required': 'Total fee is required',
  }),

  Paid_amount: Joi.number().required().messages({
    'number.base': 'Paid amount must be a number',
    'any.required': 'Paid amount is required',
  }),
});
