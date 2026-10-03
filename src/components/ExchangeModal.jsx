import { useState } from 'react';
import Button from './Button';

function ExchangeModal({ targetUser, currentUser, isOpen, onClose, onSendRequest }) {
  if (!isOpen || !targetUser) return null;

  const [mySelectedSkill, setMySelectedSkill] = useState(currentUser.skillsToTeach[0] || 'React');
  const [theirSelectedSkill, setTheirSelectedSkill] = useState(targetUser.skillsToTeach[0] || '');
  const [message, setMessage] = useState(`Hi ${targetUser.name}! I would love to exchange skills with you.`);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `req-${Date.now()}`,
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        title: currentUser.role,
      },
      toUser: {
        id: targetUser.id,
        name: targetUser.name,
        avatar: targetUser.avatar,
        title: targetUser.title,
      },
      mySkillToTeach: mySelectedSkill,
      theirSkillToTeach: theirSelectedSkill,
      message,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      direction: 'sent',
    };

    onSendRequest(newRequest);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#120e17] border border-white/15 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full mauve-gradient-btn flex items-center justify-center mx-auto text-white shadow-xl animate-bounce">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Request Sent Successfully!</h3>
            <p className="text-sm text-gray-300">
              Your exchange request has been sent to <span className="text-purple-300 font-semibold">{targetUser.name}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div>
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Skill Exchange Request
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">
                Exchange skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">{targetUser.name}</span>
              </h2>
            </div>

            {/* Exchange Offer Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              {/* My Skill Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  You will teach
                </label>
                <select
                  value={mySelectedSkill}
                  onChange={(e) => setMySelectedSkill(e.target.value)}
                  className="w-full bg-[#181320] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                >
                  {currentUser.skillsToTeach.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              {/* Their Skill Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
                  You will learn
                </label>
                <select
                  value={theirSelectedSkill}
                  onChange={(e) => setTheirSelectedSkill(e.target.value)}
                  className="w-full bg-[#181320] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                >
                  {targetUser.skillsToTeach.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Message */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300 block">Personal Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Introduce yourself and propose a time for the exchange..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Send Exchange Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ExchangeModal;
