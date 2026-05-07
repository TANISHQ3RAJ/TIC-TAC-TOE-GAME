import { motion } from 'framer-motion';
import { User, Users, Globe } from 'lucide-react';

export default function MainMenu({ onSelectMode, setPlayerName, playerName }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-md mx-auto"
    >
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] drop-shadow-sm text-center">
        Tic Tac Toe
      </h1>

      <div className="w-full bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Player Name</label>
          <input 
            type="text" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
            placeholder="Enter your name..."
            maxLength={15}
          />
        </div>

        <div className="flex flex-col gap-3">
          <MenuButton 
            icon={<User size={20} />} 
            text="Single Player (vs AI)" 
            onClick={() => onSelectMode('single')} 
            color="var(--color-neon-blue)"
          />
          <MenuButton 
            icon={<Users size={20} />} 
            text="Local Multiplayer" 
            onClick={() => onSelectMode('local')} 
            color="var(--color-neon-pink)"
          />
          <MenuButton 
            icon={<Globe size={20} />} 
            text="Online Multiplayer" 
            onClick={() => onSelectMode('online')} 
            color="#a855f7"
          />
        </div>
      </div>
    </motion.div>
  );
}

function MenuButton({ icon, text, onClick, color }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center justify-between bg-slate-700/80 hover:bg-slate-600/80 px-6 py-4 rounded-xl font-semibold transition-colors border border-transparent hover:border-slate-500"
      style={{ '--hover-color': color }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color }}>{icon}</span>
        <span>{text}</span>
      </div>
      <span className="text-slate-400 opacity-50">&rarr;</span>
    </motion.button>
  );
}
