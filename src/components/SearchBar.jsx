import { useState } from 'react';

function SearchBar({ onSearch, placeholder = "Search skills (e.g. React, Python, AWS)..." }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 text-sm transition-all duration-200 shadow-xl"
        />

        <button
          type="submit"
          className="absolute right-2 px-5 py-2.5 mauve-gradient-btn rounded-full text-xs font-semibold tracking-wide text-white cursor-pointer shadow-md hover:scale-[1.02] transition-transform"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
