const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // { roomId: { players: [{id, name, avatar, symbol}], board: Array(9), turn: 'X', winner: null } }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (data, callback) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.join(roomId);
    
    rooms[roomId] = {
      players: [{ id: socket.id, name: data.name, avatar: data.avatar, symbol: 'X' }],
      board: Array(9).fill(null),
      turn: 'X',
      winner: null
    };

    callback({ success: true, roomId, symbol: 'X' });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  socket.on('joinRoom', (data, callback) => {
    const { roomId, name, avatar } = data;
    const room = rooms[roomId];

    if (!room) {
      return callback({ success: false, message: 'Room not found' });
    }

    if (room.players.length >= 2) {
      return callback({ success: false, message: 'Room is full' });
    }

    socket.join(roomId);
    const newPlayer = { id: socket.id, name, avatar, symbol: 'O' };
    room.players.push(newPlayer);

    callback({ success: true, roomId, symbol: 'O' });
    io.to(roomId).emit('gameStart', { players: room.players, turn: room.turn });
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('makeMove', ({ roomId, index, symbol }) => {
    const room = rooms[roomId];
    if (room && room.board[index] === null && room.turn === symbol && !room.winner) {
      room.board[index] = symbol;
      
      if (checkWin(room.board)) {
        room.winner = symbol;
      } else if (room.board.every(cell => cell !== null)) {
        room.winner = 'draw';
      } else {
        room.turn = symbol === 'X' ? 'O' : 'X';
      }

      io.to(roomId).emit('gameStateUpdate', {
        board: room.board,
        turn: room.turn,
        winner: room.winner
      });
    }
  });

  socket.on('restartGame', (roomId) => {
    const room = rooms[roomId];
    if (room) {
      room.board = Array(9).fill(null);
      room.winner = null;
      // swap turn logic could be added, but for now X starts
      room.turn = 'X'; 
      io.to(roomId).emit('gameStateUpdate', {
        board: room.board,
        turn: room.turn,
        winner: room.winner
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('playerDisconnected', { message: 'Opponent disconnected' });
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

function checkWin(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
