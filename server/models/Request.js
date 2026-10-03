import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fromUser: {
      id: String,
      name: String,
      avatar: String,
      title: String,
    },
    toUser: {
      id: String,
      name: String,
      avatar: String,
      title: String,
    },
    mySkillToTeach: { type: String, required: true },
    theirSkillToTeach: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    createdAt: { type: String },
    direction: { type: String, default: 'sent' },
  },
  { timestamps: true }
);

export const SkillRequest = mongoose.model('SkillRequest', requestSchema);
