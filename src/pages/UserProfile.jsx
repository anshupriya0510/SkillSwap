import { useParams, useNavigate } from 'react';
import SkillBadge from '../components/SkillBadge';
import Button from '../components/Button';

function UserProfile({ users, onRequestExchange }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find user by ID from mock data list
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-2 text-center space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">The profile you are looking for does not exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate('/discover')}>
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-medium text-purple-300 hover:text-white transition-colors cursor-pointer bg-white/5 border border-white/10 px-4 py-2 rounded-full"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Directory</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-8 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-2 border-white/20 shadow-xl"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-purple-500/20 px-3 py-0.5 rounded-full border border-purple-500/30 text-xs font-semibold text-purple-300">
                <span>Verified Mentor</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {user.name}
              </h1>
              <p className="text-sm text-purple-200 font-medium">{user.title}</p>
              <p className="text-xs text-gray-400 flex items-center space-x-1 pt-1">
                <svg className="w-3.5 h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{user.location}</span>
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => onRequestExchange(user)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          >
            Request Exchange
          </Button>
        </div>

        {/* Bio / About Section */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">About</h3>
          <p className="text-sm text-gray-200 leading-relaxed">{user.bio}</p>
        </div>

        {/* Experience & Availability Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
              Experience Level
            </span>
            <p className="text-sm font-semibold text-white">{user.experienceLevel}</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
              Availability
            </span>
            <p className="text-sm font-semibold text-purple-200">{user.availability}</p>
          </div>
        </div>

        {/* Skills Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          {/* Can Teach */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Skills {user.name} Can Teach</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsToTeach.map((skill) => (
                <SkillBadge key={skill} name={skill} size="large" active={true} />
              ))}
            </div>
          </div>

          {/* Wants to Learn */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Skills {user.name} Wants to Learn</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsToLearn.map((skill) => (
                <SkillBadge key={skill} name={skill} size="large" active={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
