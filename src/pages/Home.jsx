import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SkillBadge from '../components/SkillBadge';
import Button from '../components/Button';

function Home() {
  const navigate = useNavigate();

  const popularSkills = [
    'React',
    'Java',
    'Python',
    'AWS',
    'Docker',
    'UI/UX',
    'Git',
    'Kubernetes',
  ];

  const handleSearch = (query) => {
    if (query) {
      navigate(`/discover?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/discover');
    }
  };

  const handleSkillClick = (skill) => {
    navigate(`/discover?search=${encodeURIComponent(skill)}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-6 px-2">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-8 pb-4 relative">
        {/* Top Glow Pill */}
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
          <span className="text-xs font-semibold tracking-wider text-purple-200 uppercase">
            Peer-to-Peer Skill Exchange
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Learn. Teach. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400">Exchange.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Connect with people who can teach what you want to learn, while sharing the skills you already know.
        </p>

        {/* Reusable SearchBar Component */}
        <div className="pt-4">
          <SearchBar onSearch={handleSearch} placeholder="Search skills to learn or teach (e.g. React, Python, AWS)..." />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            onClick={() => navigate('/discover')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          >
            Discover Skills
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/my-profile')}
            icon={
              <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            Create Profile
          </Button>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Popular Skills</span>
              <span className="text-xs font-normal text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">Trending</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Click any skill to instantly find mentors and learners</p>
          </div>
        </div>

        {/* Skill Badges Grid */}
        <div className="flex flex-wrap gap-3">
          {popularSkills.map((skill) => (
            <SkillBadge
              key={skill}
              name={skill}
              size="large"
              onClick={() => handleSkillClick(skill)}
            />
          ))}
        </div>
      </section>

      {/* How it Works / Value Proposition Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl mauve-gradient-btn flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg">
            1
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Create Your Profile</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            List the skills you master and the skills you are excited to learn next.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl mauve-gradient-btn flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg">
            2
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Find Skill Matches</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Discover community members whose learning goals match your expertise.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl mauve-gradient-btn flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg">
            3
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Exchange & Grow</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Send an exchange request, connect 1-on-1, and accelerate your skill learning journey.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
