import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '🧑',
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isAI: {
      type: Boolean,
      default: false,
    },
    originalQuestion: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ChatMessageSchema.index({ studentId: 1 });

export default mongoose.model('ChatMessage', ChatMessageSchema);
