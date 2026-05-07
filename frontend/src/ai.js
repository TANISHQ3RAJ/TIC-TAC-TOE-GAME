import { checkWin, isBoardFull } from './gameLogic';

export function getBestMove(board, difficulty) {
  const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);

  if (emptyIndices.length === 0) return -1;

  if (difficulty === 'easy') {
    // Random move
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIndex];
  }

  if (difficulty === 'medium') {
    // 50% chance to make a random move, 50% chance to make the best move
    if (Math.random() > 0.5) {
      const randomIndex = Math.floor(Math.random() * emptyIndices.length);
      return emptyIndices[randomIndex];
    }
  }

  // Hard or Medium (when hitting the 50% best move chance) uses Minimax
  return minimaxRoot(board, 'O');
}

function minimaxRoot(board, aiPlayer) {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false, aiPlayer);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, isMaximizing, aiPlayer) {
  const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
  const winResult = checkWin(board);

  if (winResult) {
    return winResult.winner === aiPlayer ? 10 - depth : depth - 10;
  }
  if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiPlayer;
        let score = minimax(board, depth + 1, false, aiPlayer);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = humanPlayer;
        let score = minimax(board, depth + 1, true, aiPlayer);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
