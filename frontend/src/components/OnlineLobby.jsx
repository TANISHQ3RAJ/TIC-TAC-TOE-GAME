import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus, LogIn } from 'lucide-react';

export default function OnlineLobby({ onBack, onCreateRoom, onJoinRoom }) {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (roomCode.trim().length === 0) {
      setError('Please enter a room code');
      return;
    }
    setError('');
    onJoinRoom(roomCode.trim().toUpperCase());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center w-full max-w-md mx-auto"
    >
      <div className="w-full flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center pr-10 text-white">Online Multiplayer</h2>
      </div>

      <div className="w-full bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col gap-6">
        
        <div className="flex flex-col items-center p-6 bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600">
          <Users size={48} className="text-[var(--color-neon-blue)] mb-4" />
          <p className="text-slate-300 text-center mb-4">Play with a friend remotely by creating a new room or joining an existing one.</p>
          
          <button 
            onClick={onCreateRoom}
            className="w-full py-3 bg-[var(--color-neon-blue)] hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create New Room
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-400">Join Existing Room</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              className="flex-1 bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-pink)] transition-colors text-center font-mono tracking-widest uppercase"
              maxLength={6}
            />
            <button 
              onClick={handleJoin}
              className="px-6 py-3 bg-[var(--color-neon-pink)] hover:bg-pink-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <LogIn size={20} />
              Join
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

      </div>
    </motion.div>
  );
}
