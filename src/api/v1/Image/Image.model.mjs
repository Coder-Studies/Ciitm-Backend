import { Schema, model } from 'mongoose';

const ImageSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'AuthenticationSchema',
    },

    albumID: {
      type: Schema.Types.String,
      ref: 'Album',
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Image', ImageSchema);
