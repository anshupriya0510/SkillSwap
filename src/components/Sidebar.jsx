import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Discover',
      path: '/discover',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      name: 'My Profile',
      path: '/my-profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Requests',
      path: '/requests',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-[#0e0b12]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl mauve-gradient-btn flex items-center justify-center font-bold text-white text-sm shadow-md">
            S
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Skill<span className="text-purple-300">Swap</span>
          </span>
        </div>

        {/* Hamburger toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#0e0b12]/95 backdrop-blur-2xl border-b border-white/10 z-40 p-4 space-y-2 shadow-2xl">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'mauve-gradient-btn font-medium shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Desktop Left Sidebar (Helios inspired) */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0e0b12]/60 backdrop-blur-2xl border-r border-white/10 p-6 fixed left-0 top-0 z-30">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-2xl mauve-gradient-btn flex items-center justify-center font-bold text-white text-lg shadow-lg">
            S
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-white tracking-tight leading-none">
              Skill<span className="text-purple-300">Swap</span>
            </h1>
            <p className="text-[11px] text-gray-400 mt-1 font-medium tracking-wide">Skill Exchange Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'mauve-gradient-btn font-medium text-white shadow-lg scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Profile Preview Card (Helios Style) */}
        <NavLink
          to="/my-profile"
          className="mt-auto bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3 hover:border-purple-400/40 transition-colors"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-full object-cover border border-purple-400/40 shadow-sm"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Rahul Sharma'}</p>
            <p className="text-[10px] text-purple-300 truncate">{currentUser?.role || 'Frontend Developer'}</p>
          </div>
        </NavLink>
      </aside>
    </>
  );
}

export default Sidebar;
