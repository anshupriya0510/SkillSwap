function Button({ children, onClick, variant = 'primary', className = '', type = 'button', icon = null }) {
  const baseStyles = 'inline-flex items-center justify-center space-x-2 rounded-full px-6 py-3 font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 select-none';
  
  const variants = {
    primary: 'mauve-gradient-btn text-white shadow-lg hover:scale-[1.02]',
    secondary: 'bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:text-white hover:border-white/20',
    outline: 'border border-purple-400/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default Button;
