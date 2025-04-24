import { Schema, model } from 'mongoose';

// a ----> Album

const AlbumSchema = new Schema(
  {
    aName: {
      type: String,
      required: true,
      trim: true,
    },

    aDescription: {
      type: String,
      required: true,
    },

    aImage_url: {
      type: String,
      required: true,
    },

    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the Album schema
let Album = model('Album', AlbumSchema);
export default Album;
