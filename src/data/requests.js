export const initialRequests = [
  {
    id: 'req-101',
    fromUser: {
      id: 'user-1',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      title: 'Senior Cloud Engineer',
    },
    toUser: {
      id: 'user-me',
      name: 'Rahul Sharma',
    },
    mySkillToTeach: 'React',
    theirSkillToTeach: 'AWS',
    message: 'Hey Rahul! I saw you teach React. I would love to learn React from you in exchange for AWS Cloud architecture mentorship!',
    status: 'Pending', // Pending | Accepted | Rejected
    createdAt: '2026-10-02',
    direction: 'received',
  },
  {
    id: 'req-102',
    fromUser: {
      id: 'user-me',
      name: 'Rahul Sharma',
    },
    toUser: {
      id: 'user-4',
      name: 'Rohan Gupta',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
      title: 'Product & UI/UX Designer',
    },
    mySkillToTeach: 'React',
    theirSkillToTeach: 'UI/UX',
    message: 'Hi Rohan! Would love to learn UI/UX design from you in exchange for React frontend guidance.',
    status: 'Accepted',
    createdAt: '2026-09-29',
    direction: 'sent',
  },
];
