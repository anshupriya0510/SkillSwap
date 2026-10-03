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

    // Full lifecycle: pending → accepted → scheduled → completed
    //                         └→ rejected   (receiver only)
    //             pending → cancelled       (sender only)
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Scheduled', 'Completed'],
      default: 'Pending',
    },

    // Set when status moves to Scheduled
    sessionLink: { type: String, default: '' },
    sessionTime: { type: String, default: '' },

    createdAt: { type: String },
    direction: { type: String, default: 'sent' },
  },
  { timestamps: true }
);

export const SkillRequest = mongoose.model('SkillRequest', requestSchema);
