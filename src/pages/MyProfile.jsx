function MyProfile() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-medium text-purple-300 mb-4">
          <span>Phase 2 Active Route</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400 leading-relaxed">
          Manage your skills, bio, availability, and preferences. Editable profile features will be added in Phase 10.
        </p>
      </div>
    </div>
  );
}

export default MyProfile;
