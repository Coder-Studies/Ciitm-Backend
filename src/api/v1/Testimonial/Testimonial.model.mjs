import { Schema, model } from 'mongoose';

const Testimonials_Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F25%2F78%2F61%2F25786134576ce0344893b33a051160b1.jpg&f=1&nofb=1&ipt=fcad687d9c12f7fce29f3ba3a92575a1dfa0a14c7420d85d6a1f3232bab75ec9',
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    job_Role: {
      type: String,
      required: true,
    },

    star: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

let Testimonial = model('Testimonial', Testimonials_Schema);
export default Testimonial;
