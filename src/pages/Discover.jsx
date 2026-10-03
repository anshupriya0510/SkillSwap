import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { SKILL_CATEGORIES, SKILL_CATEGORY_MAP } from '../data/users';

function Discover({ users, onRequestExchange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  // Keep search term synced if URL param changes (e.g., via home page navigation)
  useEffect(() => {
    const param = searchParams.get('search');
    if (param !== null) {
      setSearchTerm(param);
    }
  }, [searchParams]);

  // Extract all unique skills available across all users for the skill filter dropdown
  const allSkillsList = useMemo(() => {
    const skillSet = new Set();
    users.forEach((user) => {
      user.skillsToTeach.forEach((skill) => skillSet.add(skill));
      user.skillsToLearn.forEach((skill) => skillSet.add(skill));
    });
    return ['All', ...Array.from(skillSet).sort()];
  }, [users]);

  // Comprehensive filter logic using JS array filter(), includes(), map(), and logic combination
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search term matching (case insensitive)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        user.name.toLowerCase().includes(term) ||
        user.title.toLowerCase().includes(term) ||
        user.bio.toLowerCase().includes(term) ||
        user.skillsToTeach.some((s) => s.toLowerCase().includes(term)) ||
        user.skillsToLearn.some((s) => s.toLowerCase().includes(term));

      // Category filter matching
      const matchesCategory =
        selectedCategory === 'All' ||
        user.skillsToTeach.some((s) => SKILL_CATEGORY_MAP[s] === selectedCategory) ||
        user.skillsToLearn.some((s) => SKILL_CATEGORY_MAP[s] === selectedCategory);

      // Specific Skill dropdown matching
      const matchesSkill =
        selectedSkill === 'All' ||
        user.skillsToTeach.includes(selectedSkill) ||
        user.skillsToLearn.includes(selectedSkill);

      return matchesSearch && matchesCategory && matchesSkill;
    });
  }, [users, searchTerm, selectedCategory, selectedSkill]);

  const handleSearchSubmit = (query) => {
    setSearchTerm(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSkill('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-300">
          <span>Explore Community Mentors</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">Skill Partners</span>
        </h1>
        <p className="text-gray-300 text-sm max-w-xl">
          Find peers who excel in what you want to learn, and share your own expertise.
        </p>
      </div>

      {/* Search & Filtering Control Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearchSubmit}
          placeholder="Search by skill name, user title, or keyword..."
        />

        {/* Category Pills & Dropdown Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'mauve-gradient-btn text-white shadow-md scale-105'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skill Filter Dropdown */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs text-gray-400 font-medium">Filter Skill:</span>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-[#181320] border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              {allSkillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill === 'All' ? 'All Specific Skills' : skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-gray-400">
          <span>
            Showing <strong className="text-white">{filteredUsers.length}</strong> of{' '}
            <strong className="text-white">{users.length}</strong> mentors
          </span>

          {(searchTerm || selectedCategory !== 'All' || selectedSkill !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="text-purple-300 hover:text-pink-300 font-medium underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Profile Cards Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onRequestExchange={onRequestExchange} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center space-y-4 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-purple-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">No Matching Mentors Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            We couldn't find any users matching your search criteria. Try searching for "React", "AWS", "Python", or reset filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 mauve-gradient-btn rounded-full text-xs font-medium text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Discover;
