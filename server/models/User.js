import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, default: 'Community Member' },
    location: { type: String, default: 'Remote' },
    avatar: { type: String },
    bio: { type: String },
    skillsToTeach: [{ type: String }],
    skillsToLearn: [{ type: String }],
    experienceLevel: { type: String, default: 'Intermediate' },
    availability: { type: String, default: 'Flexible' },
    isCurrentUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
