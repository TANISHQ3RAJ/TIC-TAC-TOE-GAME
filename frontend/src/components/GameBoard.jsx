import { motion } from 'framer-motion';

export default function GameBoard({ board, onCellClick, winningLine }) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[320px] mx-auto sm:max-w-[400px]">
      {board.map((cell, idx) => {
        const isWinningCell = winningLine?.includes(idx);
        return (
          <motion.button
            key={idx}
            whileHover={!cell ? { scale: 1.05 } : {}}
            whileTap={!cell ? { scale: 0.95 } : {}}
            onClick={() => onCellClick(idx)}
            className={`h-24 sm:h-32 bg-slate-800/80 backdrop-blur-sm dark:bg-slate-800/80 light:bg-white/90 rounded-xl shadow-lg flex items-center justify-center text-4xl sm:text-6xl font-bold transition-colors border-2 ${
              isWinningCell ? 'border-green-400 bg-green-900/20' : 'border-slate-700 hover:border-slate-500'
            }`}
            disabled={cell !== null}
          >
            {cell === 'X' && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[var(--color-neon-blue)] drop-shadow-[0_0_10px_var(--color-neon-blue)]"
              >
                X
              </motion.span>
            )}
            {cell === 'O' && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[var(--color-neon-pink)] drop-shadow-[0_0_10px_var(--color-neon-pink)]"
              >
                O
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
