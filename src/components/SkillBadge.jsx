function SkillBadge({ name, onClick, active = false, size = 'medium' }) {
  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-1.5 text-xs',
    large: 'px-5 py-2 text-sm',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center space-x-1.5 rounded-full font-medium transition-all duration-200 border cursor-pointer select-none ${
        sizeClasses[size] || sizeClasses.medium
      } ${
        active
          ? 'mauve-gradient-btn text-white border-transparent shadow-md scale-105'
          : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10 hover:border-purple-400/40 hover:text-white hover:scale-105'
      }`}
    >
      <span>{name}</span>
    </span>
  );
}

export default SkillBadge;
