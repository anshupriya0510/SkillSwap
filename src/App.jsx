function App() {
  return (
    <div className="min-h-screen bg-[#0b090e] text-gray-100 helios-glow-bg flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
        {/* Brand Header */}
        <div className="inline-flex items-center space-x-3 mb-6 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse"></div>
          <span className="text-xs font-semibold tracking-wider uppercase text-purple-300">Phase 1 Initialized</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-white">
          Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">Swap</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Skill Exchange Platform — Learn. Teach. Exchange.
        </p>

        {/* Action card / Badge */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 mb-6 text-left flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Tech Stack</p>
            <p className="text-sm font-medium text-purple-200">Vite + React.js + Tailwind CSS v4</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Active
          </span>
        </div>

        <button className="w-full py-3 rounded-full mauve-gradient-btn font-medium text-sm tracking-wide cursor-pointer">
          Project Setup Complete
        </button>
      </div>
    </div>
  )
}

export default App
