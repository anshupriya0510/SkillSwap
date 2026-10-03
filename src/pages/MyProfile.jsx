import { useState } from 'react';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import Avatar from '../components/Avatar';

function MyProfile({ currentUser, onSaveProfile }) {
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    role: currentUser.role || '',
    location: currentUser.location || '',
    bio: currentUser.bio || '',
    avatar: currentUser.avatar || '',
    skillsToTeachInput: currentUser.skillsToTeach ? currentUser.skillsToTeach.join(', ') : '',
    skillsToLearnInput: currentUser.skillsToLearn ? currentUser.skillsToLearn.join(', ') : '',
    experienceLevel: currentUser.experienceLevel || '',
    availability: currentUser.availability || '',
    contactMethod: currentUser.contact?.method || '',
    contactValue: currentUser.contact?.value || '',
  });

  const [contactError, setContactError] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert comma-separated string inputs into cleaned string arrays
    const skillsToTeach = formData.skillsToTeachInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const skillsToLearn = formData.skillsToLearnInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Validate contact value format
    let contactErr = '';
    if (formData.contactMethod && formData.contactValue) {
      const v = formData.contactValue.trim();
      if (formData.contactMethod === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        contactErr = 'Enter a valid email address.';
      } else if (formData.contactMethod === 'WhatsApp' && !/^\d{7,15}$/.test(v.replace(/[\s+()-]/g, ''))) {
        contactErr = 'Enter a valid WhatsApp number (digits only, 7-15 chars).';
      } else if (formData.contactMethod === 'LinkedIn' && !/https?:\/\//i.test(v)) {
        contactErr = 'Enter a full LinkedIn URL starting with https://';
      }
    }
    if (contactErr) {
      setContactError(contactErr);
      return;
    }
    setContactError('');

    const updatedProfile = {
      ...currentUser,
      name: formData.name,
      role: formData.role,
      location: formData.location,
      bio: formData.bio,
      avatar: formData.avatar,
      skillsToTeach,
      skillsToLearn,
      experienceLevel: formData.experienceLevel,
      availability: formData.availability,
      contact: {
        method: formData.contactMethod || '',
        value: formData.contactValue.trim() || '',
      },
    };

    onSaveProfile(updatedProfile);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-300">
          <span>Personal Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">Profile & Settings</span>
        </h1>
        <p className="text-gray-300 text-sm max-w-xl">
          Edit your public details, expertise, learning goals, and profile photo preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-6 py-4 rounded-3xl flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold">Profile updated and saved successfully!</span>
          </div>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Avatar & Header Preview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-5">
            {/* Reusable Avatar Component */}
            <Avatar src={formData.avatar} name={formData.name} size="lg" />

            <div>
              <h2 className="text-2xl font-bold text-white">{formData.name || 'Your Name'}</h2>
              <p className="text-xs text-purple-300 font-medium">{formData.role || 'Your Title'}</p>
              <p className="text-[11px] text-gray-400 mt-1">{formData.location || 'Your Location'}</p>
            </div>
          </div>

          {/* Photo Removal Button */}
          {formData.avatar ? (
            <Button
              variant="secondary"
              type="button"
              onClick={handleRemovePhoto}
              className="text-xs text-rose-300 border-rose-500/30 hover:bg-rose-500/10 shrink-0"
              icon={
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Remove Photo
            </Button>
          ) : (
            <span className="text-xs text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 font-medium">
              Using Initials Avatar
            </span>
          )}
        </div>

        {/* Profile Photo URL Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
            Profile Photo URL (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="Paste image link URL (e.g. https://images.unsplash.com/...) or leave empty"
              className="flex-1 bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
            {formData.avatar && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Basic Info Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Role / Title</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Experience Level</label>
            <input
              type="text"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              placeholder="e.g. Intermediate (3 years)"
              className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Bio Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">About / Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            required
            className="w-full bg-[#181320] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Skills Tag Edit Sections */}
        <div className="space-y-6 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Skills You Can Teach (Comma-separated)
            </label>
            <input
              type="text"
              name="skillsToTeachInput"
              value={formData.skillsToTeachInput}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, Git, Tailwind"
              className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.skillsToTeachInput.split(',').map((skill, idx) => (
                skill.trim() && <SkillBadge key={idx} name={skill.trim()} size="small" active={true} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
              Skills You Want to Learn (Comma-separated)
            </label>
            <input
              type="text"
              name="skillsToLearnInput"
              value={formData.skillsToLearnInput}
              onChange={handleChange}
              placeholder="e.g. AWS, Docker, Python, UI/UX"
              className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.skillsToLearnInput.split(',').map((skill, idx) => (
                skill.trim() && <SkillBadge key={idx} name={skill.trim()} size="small" active={false} />
              ))}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Weekly Availability</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g. 8-10 hrs/week (Evenings & Weekends)"
            className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* ── Contact Details (private) ──────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-1">
              🔒 Private Contact Details
            </label>
            <p className="text-xs text-gray-500">
              Only shown to people <strong className="text-gray-400">after a request between you is accepted</strong>. Never visible publicly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Contact Method</label>
              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleChange}
                className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                <option value="">-- Select --</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                {formData.contactMethod === 'Email' && 'Email Address'}
                {formData.contactMethod === 'WhatsApp' && 'WhatsApp Number (with country code)'}
                {formData.contactMethod === 'LinkedIn' && 'LinkedIn Profile URL'}
                {!formData.contactMethod && 'Contact Value'}
              </label>
              <input
                type="text"
                name="contactValue"
                value={formData.contactValue}
                onChange={handleChange}
                placeholder={
                  formData.contactMethod === 'Email' ? 'you@example.com' :
                  formData.contactMethod === 'WhatsApp' ? '919876543210' :
                  formData.contactMethod === 'LinkedIn' ? 'https://linkedin.com/in/yourname' :
                  'Select a method first'
                }
                disabled={!formData.contactMethod}
                className="w-full bg-[#181320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400 disabled:opacity-40"
              />
              {contactError && (
                <p className="text-xs text-rose-400 mt-1">{contactError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button variant="primary" type="submit">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MyProfile;
