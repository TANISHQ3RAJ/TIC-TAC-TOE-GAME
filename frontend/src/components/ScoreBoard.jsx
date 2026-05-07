import { motion } from 'framer-motion';

export default function ScoreBoard({ scores, turn, mode, players }) {
  return (
    <div className="flex justify-between items-center w-full max-w-[320px] sm:max-w-[400px] mx-auto mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-700">
      <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${turn === 'X' ? 'bg-slate-700' : ''}`}>
        <span className="text-xs text-slate-400 font-semibold mb-1">
          {mode === 'online' ? players.find(p => p.symbol === 'X')?.name || 'Player X' : 'Player X'}
        </span>
        <span className="text-2xl font-bold text-[var(--color-neon-blue)]">{scores.X}</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-sm text-slate-500 font-medium tracking-widest uppercase">Score</span>
        <span className="text-xs text-slate-400 mt-1">
          Turn: <span className={turn === 'X' ? 'text-[var(--color-neon-blue)]' : 'text-[var(--color-neon-pink)]'}>{turn}</span>
        </span>
      </div>

      <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${turn === 'O' ? 'bg-slate-700' : ''}`}>
        <span className="text-xs text-slate-400 font-semibold mb-1">
          {mode === 'online' ? players.find(p => p.symbol === 'O')?.name || 'Player O' : (mode === 'single' ? 'Computer O' : 'Player O')}
        </span>
        <span className="text-2xl font-bold text-[var(--color-neon-pink)]">{scores.O}</span>
      </div>
    </div>
  );
}
