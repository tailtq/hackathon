import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isBot: {
    type: Boolean,
    required: true,
    default: false,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model('messages', messageSchema);
