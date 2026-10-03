// Seed requests — one in each key status so all UI states are testable immediately.
// Contact details (otherUserContact) are populated at runtime by the server based on status.

export const initialRequests = [
  // ── Received, Pending ── Priya → Rahul (Rahul sees Accept / Reject buttons)
  {
    id: 'req-101',
    fromUser: {
      id: 'user-1',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      title: 'Senior Cloud Engineer',
    },
    toUser: { id: 'user-me', name: 'Rahul Sharma' },
    mySkillToTeach: 'React',
    theirSkillToTeach: 'AWS',
    message: "Hey Rahul! I saw you teach React — I'd love to learn it in exchange for AWS Cloud architecture mentorship!",
    status: 'Pending',
    createdAt: '2026-10-02',
    direction: 'received',
    sessionLink: '',
    sessionTime: '',
  },

  // ── Sent, Accepted ── Rahul → Rohan (shows Contact panel + Schedule form)
  {
    id: 'req-102',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: {
      id: 'user-4',
      name: 'Rohan Gupta',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
      title: 'Product & UI/UX Designer',
    },
    mySkillToTeach: 'React',
    theirSkillToTeach: 'UI/UX',
    message: 'Hi Rohan! Would love to learn UI/UX from you in exchange for React frontend guidance.',
    status: 'Accepted',
    createdAt: '2026-09-29',
    direction: 'sent',
    sessionLink: '',
    sessionTime: '',
  },

  // ── Received, Scheduled ── Aarav → Rahul (shows session details + Mark Completed)
  {
    id: 'req-103',
    fromUser: {
      id: 'user-2',
      name: 'Aarav Mehta',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
      title: 'Full Stack Engineer',
    },
    toUser: { id: 'user-me', name: 'Rahul Sharma' },
    mySkillToTeach: 'JavaScript',
    theirSkillToTeach: 'Java',
    message: 'Hey Rahul, let us swap JavaScript for Java knowledge. I have scheduled a session for us!',
    status: 'Scheduled',
    createdAt: '2026-09-25',
    direction: 'received',
    sessionLink: 'https://meet.google.com/abc-defg-hij',
    sessionTime: 'Oct 10, 2026 — 7:00 PM IST',
  },

  // ── Sent, Completed ── Rahul → Ananya (shows Completed badge + contact)
  {
    id: 'req-104',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: {
      id: 'user-3',
      name: 'Ananya Verma',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
      title: 'Data Scientist & ML Engineer',
    },
    mySkillToTeach: 'React',
    theirSkillToTeach: 'Python',
    message: 'Looking forward to learning Python for data automation from you!',
    status: 'Completed',
    createdAt: '2026-09-15',
    direction: 'sent',
    sessionLink: 'https://zoom.us/j/1234567890',
    sessionTime: 'Sep 20, 2026 — 6:00 PM IST',
  },

  // ── Sent, Rejected ── Rahul → Devansh
  {
    id: 'req-105',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: {
      id: 'user-5',
      name: 'Devansh Nair',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      title: 'DevOps & Infrastructure Specialist',
    },
    mySkillToTeach: 'JavaScript',
    theirSkillToTeach: 'Docker',
    message: 'Hi Devansh, would love to learn Docker from you!',
    status: 'Rejected',
    createdAt: '2026-09-10',
    direction: 'sent',
    sessionLink: '',
    sessionTime: '',
  },

  // ── Sent, Cancelled ── Rahul → Sneha
  {
    id: 'req-106',
    fromUser: { id: 'user-me', name: 'Rahul Sharma' },
    toUser: {
      id: 'user-6',
      name: 'Sneha Rao',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      title: 'Frontend Engineer',
    },
    mySkillToTeach: 'Git',
    theirSkillToTeach: 'Node.js',
    message: 'Would love to learn backend Node.js from you!',
    status: 'Cancelled',
    createdAt: '2026-09-05',
    direction: 'sent',
    sessionLink: '',
    sessionTime: '',
  },
];

/*
  Test user contact info (saved in MongoDB via users seed):
  ─────────────────────────────────────────────────────────
  Priya Patel (user-1)  → LinkedIn: https://linkedin.com/in/priya-patel-cloud
  Aarav Mehta (user-2)  → Email: aarav.mehta@example.com
  Ananya Verma (user-3) → WhatsApp: 9123456780
  Rohan Gupta (user-4)  → LinkedIn: https://linkedin.com/in/rohan-gupta-design
  Rahul Sharma (user-me)→ WhatsApp: 9876543210

  These are revealed on the Requests page ONLY when status is Accepted / Scheduled / Completed.
*/
