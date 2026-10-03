/**
 * SkillSwap Seed Script
 * ─────────────────────
 * Drops existing users + requests, then inserts:
 *   • user-me    (Rahul Sharma)  — WhatsApp contact
 *   • user-alpha (Priya Patel)  — LinkedIn contact
 *   • One request in every status: Pending, Accepted, Scheduled, Completed, Rejected, Cancelled
 *
 * Run: node server/seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

// ── Inline schemas (no circular imports) ──────────────────────────────────────
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
    contact: {
      method: { type: String, enum: ['Email', 'WhatsApp', 'LinkedIn', ''], default: '' },
      value: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const requestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fromUser: { id: String, name: String, avatar: String, title: String },
    toUser: { id: String, name: String, avatar: String, title: String },
    mySkillToTeach: { type: String, required: true },
    theirSkillToTeach: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Scheduled', 'Completed'],
      default: 'Pending',
    },
    sessionLink: { type: String, default: '' },
    sessionTime: { type: String, default: '' },
    createdAt: { type: String },
    direction: { type: String, default: 'sent' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const SkillRequest = mongoose.model('SkillRequest', requestSchema);

// ── User records ──────────────────────────────────────────────────────────────
const RAHUL = {
  id: 'user-me',
  name: 'Rahul Sharma',
  title: 'Frontend Developer',
  location: 'Bengaluru, India',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
  bio: 'Passionate React & Web developer. Looking to expand into Cloud and DevOps.',
  skillsToTeach: ['React', 'JavaScript', 'Git'],
  skillsToLearn: ['AWS', 'Docker', 'Python'],
  experienceLevel: 'Intermediate (3 years)',
  availability: '8-10 hrs/week (Evenings & Weekends)',
  isCurrentUser: true,
  contact: { method: 'WhatsApp', value: '919876543210' },
};

const PRIYA = {
  id: 'user-alpha',
  name: 'Priya Patel',
  title: 'Senior Cloud Engineer',
  location: 'Mumbai, India',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  bio: 'AWS Certified Solutions Architect with 6+ years experience. Excited to learn UI/UX.',
  skillsToTeach: ['AWS', 'Docker', 'Kubernetes'],
  skillsToLearn: ['UI/UX', 'React', 'Figma'],
  experienceLevel: 'Advanced (6+ yrs)',
  availability: '5 hrs/week (Weekends)',
  isCurrentUser: false,
  contact: { method: 'LinkedIn', value: 'https://linkedin.com/in/priya-patel-cloud' },
};

const COMMUNITY_USERS = [
  {
    id: 'user-1', name: 'Aarav Mehta', title: 'Full Stack Engineer', location: 'Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
    bio: 'Backend lover, expert in Java & Spring Boot.',
    skillsToTeach: ['Java', 'SQL', 'Git'], skillsToLearn: ['React', 'JavaScript', 'UI/UX'],
    experienceLevel: 'Intermediate (4 yrs)', availability: '6 hrs/week (Flexible)',
    contact: { method: 'Email', value: 'aarav.mehta@example.com' },
  },
  {
    id: 'user-2', name: 'Ananya Verma', title: 'Data Scientist & ML Engineer', location: 'Hyderabad, India',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    bio: 'Building ML pipelines with Python. Eager to deploy on AWS.',
    skillsToTeach: ['Python', 'Data Science', 'Machine Learning', 'SQL'],
    skillsToLearn: ['AWS', 'Docker', 'Kubernetes'],
    experienceLevel: 'Advanced (5 yrs)', availability: '4 hrs/week (Weekdays)',
    contact: { method: 'WhatsApp', value: '919123456780' },
  },
  {
    id: 'user-3', name: 'Rohan Gupta', title: 'Product & UI/UX Designer', location: 'Pune, India',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    bio: 'Crafting pixel-perfect interfaces in Figma.',
    skillsToTeach: ['UI/UX', 'Figma', 'Web Design'], skillsToLearn: ['React', 'JavaScript', 'Git'],
    experienceLevel: 'Intermediate (3 yrs)', availability: '10 hrs/week (Evenings)',
    contact: { method: 'LinkedIn', value: 'https://linkedin.com/in/rohan-gupta-design' },
  },
  {
    id: 'user-4', name: 'Devansh Nair', title: 'DevOps & Infrastructure Specialist', location: 'Kochi, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bio: 'Automating pipelines with CI/CD and Kubernetes.',
    skillsToTeach: ['Docker', 'Kubernetes', 'CI/CD', 'Git'], skillsToLearn: ['Python', 'AWS', 'Node.js'],
    experienceLevel: 'Expert (7 yrs)', availability: '5 hrs/week (Weekends)',
    contact: { method: 'Email', value: 'devansh.nair@example.com' },
  },
  {
    id: 'user-5', name: 'Sneha Rao', title: 'Frontend Engineer', location: 'Chennai, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bio: 'Building responsive React apps. Passionate about learning Node.js.',
    skillsToTeach: ['React', 'JavaScript', 'Web Design'], skillsToLearn: ['Node.js', 'Java', 'SQL'],
    experienceLevel: 'Intermediate (2 yrs)', availability: '8 hrs/week (Weekdays)',
    contact: { method: 'WhatsApp', value: '919988776655' },
  },
];

const PRIYA_STUB = {
  id: 'user-alpha', name: 'Priya Patel', title: 'Senior Cloud Engineer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
};

// ── Request records (one per status) ──────────────────────────────────────────
const REQUESTS = [
  // Pending — Priya → Rahul (Rahul sees Accept / Reject)
  {
    id: 'req-seed-001',
    fromUser: PRIYA_STUB,
    toUser: { id: 'user-me', name: 'Rahul Sharma' },
    mySkillToTeach: 'React', theirSkillToTeach: 'AWS',
    message: "Hey Rahul! I'd love to learn React in exchange for AWS mentorship.",
    status: 'Pending', createdAt: '2026-10-01', direction: 'received',
    sessionLink: '', sessionTime: '',
  },
  // Accepted — Rahul → Priya (shows contact + Schedule form)
  {
    id: 'req-seed-002',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: PRIYA_STUB,
    mySkillToTeach: 'JavaScript', theirSkillToTeach: 'Docker',
    message: 'Hi Priya! Looking to learn Docker from you while I help with JS.',
    status: 'Accepted', createdAt: '2026-09-28', direction: 'sent',
    sessionLink: '', sessionTime: '',
  },
  // Scheduled — Priya → Rahul (shows session link + Mark Completed)
  {
    id: 'req-seed-003',
    fromUser: PRIYA_STUB,
    toUser: { id: 'user-me', name: 'Rahul Sharma' },
    mySkillToTeach: 'Git', theirSkillToTeach: 'Kubernetes',
    message: 'Let us swap Git mastery for Kubernetes knowledge!',
    status: 'Scheduled', createdAt: '2026-09-20', direction: 'received',
    sessionLink: 'https://meet.google.com/seed-demo-link',
    sessionTime: 'Oct 15, 2026 — 7:00 PM IST',
  },
  // Completed — Rahul → Priya
  {
    id: 'req-seed-004',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: PRIYA_STUB,
    mySkillToTeach: 'React', theirSkillToTeach: 'Kubernetes',
    message: 'Great session! Loved learning Kubernetes from you.',
    status: 'Completed', createdAt: '2026-09-10', direction: 'sent',
    sessionLink: 'https://zoom.us/j/seed-completed',
    sessionTime: 'Sep 18, 2026 — 6:00 PM IST',
  },
  // Rejected — Rahul → Priya (she rejected)
  {
    id: 'req-seed-005',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: PRIYA_STUB,
    mySkillToTeach: 'Git', theirSkillToTeach: 'AWS',
    message: 'Hi Priya, could we swap Git for AWS?',
    status: 'Rejected', createdAt: '2026-09-05', direction: 'sent',
    sessionLink: '', sessionTime: '',
  },
  // Cancelled — Rahul → Priya (Rahul cancelled)
  {
    id: 'req-seed-006',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: PRIYA_STUB,
    mySkillToTeach: 'JavaScript', theirSkillToTeach: 'Kubernetes',
    message: 'Would love to exchange Kubernetes for JS basics.',
    status: 'Cancelled', createdAt: '2026-09-01', direction: 'sent',
    sessionLink: '', sessionTime: '',
  },
];

// ── Run ───────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    await User.deleteMany({});
    await SkillRequest.deleteMany({});
    console.log('🗑️  Cleared existing users and requests');

    await User.insertMany([RAHUL, PRIYA, ...COMMUNITY_USERS]);
    console.log(`👥 Inserted ${2 + COMMUNITY_USERS.length} users`);

    await SkillRequest.insertMany(REQUESTS);
    console.log(`📋 Inserted ${REQUESTS.length} requests (one per lifecycle status)`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  SkillSwap Seed Complete — Test Logins');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  User A (normal window)    → user-me    | Rahul Sharma');
    console.log('    Contact (WhatsApp): 919876543210');
    console.log('');
    console.log('  User B (incognito / other)→ user-alpha | Priya Patel');
    console.log('    Contact (LinkedIn): https://linkedin.com/in/priya-patel-cloud');
    console.log('');
    console.log('  Requests seeded (from Rahul POV):');
    console.log('    req-seed-001  Pending   (received) → Accept or Reject');
    console.log('    req-seed-002  Accepted  (sent)     → See contact + Schedule form');
    console.log('    req-seed-003  Scheduled (received) → Session link + Mark Completed');
    console.log('    req-seed-004  Completed (sent)     → Completed badge + contact');
    console.log('    req-seed-005  Rejected  (sent)     → Rejected status badge');
    console.log('    req-seed-006  Cancelled (sent)     → Cancelled status badge');
    console.log('═══════════════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
