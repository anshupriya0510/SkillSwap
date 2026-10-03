import { useNavigate } from 'react-router-dom';
import SkillBadge from './SkillBadge';
import Button from './Button';
import Avatar from './Avatar';

function UserCard({ user, onRequestExchange }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:shadow-purple-500/5">
      <div className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                {user.name}
              </h3>
              <p className="text-xs text-purple-200/80 font-medium">{user.title}</p>
            </div>
          </div>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium shrink-0">
            <svg className="w-3 h-3 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{user.location}</span>
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
          {user.bio}
        </p>

        {/* Skills Section */}
        <div className="space-y-3 pt-2">
          {/* Can Teach */}
          <div>
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Can Teach</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsToTeach.map((skill) => (
                <SkillBadge key={skill} name={skill} size="small" active={true} />
              ))}
            </div>
          </div>

          {/* Wants to Learn */}
          <div>
            <p className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>Wants to Learn</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsToLearn.map((skill) => (
                <SkillBadge key={skill} name={skill} size="small" active={false} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate(`/profile/${user.id}`)}
          className="flex-1 py-2 text-xs"
        >
          View Profile
        </Button>
        <Button
          variant="primary"
          onClick={() => onRequestExchange(user)}
          className="flex-1 py-2 text-xs"
        >
          Request Exchange
        </Button>
      </div>
    </div>
  );
}

export default UserCard;
