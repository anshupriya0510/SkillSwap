function Avatar({ src, name, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs rounded-xl',
    md: 'w-13 h-13 text-sm rounded-2xl',
    lg: 'w-20 h-20 md:w-24 md:h-24 text-2xl rounded-3xl',
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizeClasses[size] || sizeClasses.md} object-cover border border-white/20 shadow-md ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} mauve-gradient-btn flex items-center justify-center font-extrabold text-white shadow-md border border-white/20 select-none ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export default Avatar;
