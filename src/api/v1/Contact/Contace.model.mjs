import { model, Schema } from 'mongoose';

// c ------> Contact

let ContactSchema = new Schema(
  {
    cName: {
      type: String,
      required: true,
      capitalize: true,
    },

    cEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    cNumber: {
      type: Number,
      required: true,
    },

    cMessage: {
      type: String,
      required: true,
      capitalize: true,
    },
  },
  { timestamps: true }
);

let Contact = model('Contact', ContactSchema);

export default Contact;
