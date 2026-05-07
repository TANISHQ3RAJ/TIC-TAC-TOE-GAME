import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { io } from 'socket.io-client';
import { ArrowLeft, RotateCcw } from 'lucide-react';

import MainMenu from './components/MainMenu';
import ThemeToggle from './components/ThemeToggle';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import OnlineLobby from './components/OnlineLobby';
import { checkWin, isBoardFull } from './gameLogic';
import { getBestMove } from './ai';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [view, setView] = useState('menu'); // menu, lobby, game
  const [mode, setMode] = useState(null); // single, local, online
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [playerName, setPlayerName] = useState('Player 1');
  
  // Game State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null); // 'X', 'O', 'draw', null
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  // Online State
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [mySymbol, setMySymbol] = useState(null);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [onlineError, setOnlineError] = useState('');

  // Apply Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Setup Socket Listeners
  useEffect(() => {
    if (mode === 'online' && !socket) {
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      newSocket.on('gameStart', (data) => {
        setOnlinePlayers(data.players);
        setTurn(data.turn);
        setView('game');
      });

      newSocket.on('gameStateUpdate', (data) => {
        setBoard(data.board);
        setTurn(data.turn);
        if (data.winner) {
          setWinner(data.winner);
          if (data.winner === 'X' || data.winner === 'O') {
            const winData = checkWin(data.board);
            setWinningLine(winData?.line || null);
            setScores(prev => ({ ...prev, [data.winner]: prev[data.winner] + 1 }));
          }
        } else {
          setWinner(null);
          setWinningLine(null);
        }
      });

      newSocket.on('playerDisconnected', (data) => {
        setOnlineError(data.message);
        setTimeout(() => {
          handleBackToMenu();
        }, 3000);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [mode, socket]);

  // AI Move logic
  useEffect(() => {
    if (mode === 'single' && turn === 'O' && !winner) {
      const timer = setTimeout(() => {
        const bestMove = getBestMove(board, difficulty);
        if (bestMove !== -1) {
          handleCellClick(bestMove, true);
        }
      }, 500); // Slight delay for AI realism
      return () => clearTimeout(timer);
    }
  }, [turn, mode, board, winner]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'online') {
      setView('lobby');
    } else {
      if (selectedMode === 'single') {
        // prompt difficulty conceptually, hardcoded to medium for now or could add a quick sub-menu
        setDifficulty('hard'); // default hard for demo
      }
      resetGame(true);
      setView('game');
    }
  };

  const handleCellClick = (index, isAi = false) => {
    if (board[index] || winner) return;

    if (mode === 'online') {
      if (turn !== mySymbol) return; // Not your turn
      socket.emit('makeMove', { roomId, index, symbol: mySymbol });
      return;
    }

    // Local / Single Player
    if (mode === 'single' && !isAi && turn === 'O') return; // Wait for AI

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const winResult = checkWin(newBoard);
    if (winResult) {
      setWinner(winResult.winner);
      setWinningLine(winResult.line);
      setScores(prev => ({ ...prev, [winResult.winner]: prev[winResult.winner] + 1 }));
    } else if (isBoardFull(newBoard)) {
      setWinner('draw');
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = (fullReset = false) => {
    if (mode === 'online') {
      socket.emit('restartGame', roomId);
      return;
    }
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setWinningLine(null);
    if (fullReset) {
      setScores({ X: 0, O: 0 });
    }
  };

  const handleBackToMenu = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setView('menu');
    setMode(null);
    setRoomId(null);
    setMySymbol(null);
    setOnlinePlayers([]);
    setOnlineError('');
  };

  // Online Room Actions
  const handleCreateRoom = () => {
    socket.emit('createRoom', { name: playerName, avatar: '😎' }, (response) => {
      if (response.success) {
        setRoomId(response.roomId);
        setMySymbol(response.symbol);
        setView('game'); // wait in game view
      }
    });
  };

  const handleJoinRoom = (code) => {
    socket.emit('joinRoom', { roomId: code, name: playerName, avatar: '🤓' }, (response) => {
      if (response.success) {
        setRoomId(response.roomId);
        setMySymbol(response.symbol);
        // view changes to game automatically via gameStart event
      } else {
        setOnlineError(response.message);
      }
    });
  };

  const renderGameMessage = () => {
    if (onlineError) return <span className="text-red-400">{onlineError}</span>;
    if (mode === 'online' && onlinePlayers.length < 2) {
      return <span>Room Code: <span className="font-mono text-[var(--color-neon-blue)]">{roomId}</span> - Waiting for opponent...</span>;
    }
    if (winner === 'draw') return "It's a Draw!";
    if (winner) return `Player ${winner} Wins!`;
    if (mode === 'online') {
      return turn === mySymbol ? "Your Turn" : "Opponent's Turn";
    }
    return `Player ${turn}'s Turn`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ThemeToggle isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
      
      {winner && winner !== 'draw' && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          recycle={false} 
          numberOfPieces={500} 
          gravity={0.15}
        />
      )}

      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <MainMenu 
            key="menu" 
            onSelectMode={handleModeSelect} 
            playerName={playerName} 
            setPlayerName={setPlayerName} 
          />
        )}

        {view === 'lobby' && (
          <OnlineLobby 
            key="lobby" 
            onBack={handleBackToMenu}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        )}

        {view === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full max-w-[320px] sm:max-w-[400px] flex justify-between items-center mb-6">
              <button onClick={handleBackToMenu} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                <ArrowLeft size={20} />
              </button>
              
              {mode === 'single' && (
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none"
                  disabled={board.some(c => c !== null) && !winner}
                >
                  <option value="easy">Easy AI</option>
                  <option value="medium">Medium AI</option>
                  <option value="hard">Hard AI</option>
                </select>
              )}
              {mode === 'online' && (
                 <div className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 font-mono">
                    Room: {roomId}
                 </div>
              )}
            </div>

            <ScoreBoard scores={scores} turn={turn} mode={mode} players={onlinePlayers} />

            <div className="h-12 mb-4 flex items-center justify-center text-xl font-bold text-slate-200">
              {renderGameMessage()}
            </div>

            <GameBoard board={board} onCellClick={handleCellClick} winningLine={winningLine} />

            {winner && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => resetGame(false)}
                className="mt-8 flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-opacity"
              >
                <RotateCcw size={20} />
                Play Again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
