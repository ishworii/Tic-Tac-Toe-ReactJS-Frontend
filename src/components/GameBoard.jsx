import React, { useEffect, useState } from 'react';
import '../styles/GameBoard.css';
import Cell from './Cell';

const PLAYERS = {
  HUMAN: 'X',
  AI: 'O'
};

const GAME_STATES = {
  PLAYING: 'PLAYING',
  WIN: 'WIN',
  DRAW: 'DRAW',
  ERROR: 'ERROR'
};

function GameBoard({ firstPlayer, boardSize, onRestart }) {
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(firstPlayer);
  const [gameStatus, setGameStatus] = useState(GAME_STATES.PLAYING);
  const [isLoading, setIsLoading] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  useEffect(() => {
    if (currentPlayer === 'AI' && gameStatus === GAME_STATES.PLAYING) {
      makeAIMove();
    }
  }, [currentPlayer, gameStatus]);

  const getWinningCombinations = () => {
    const combinations = [];
    
    // Rows
    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(i * boardSize + j);
      }
      combinations.push({ combo: row, type: 'horizontal', class: `row-${i}` });
    }

    // Columns
    for (let i = 0; i < boardSize; i++) {
      const col = [];
      for (let j = 0; j < boardSize; j++) {
        col.push(j * boardSize + i);
      }
      combinations.push({ combo: col, type: 'vertical', class: `col-${i}` });
    }

    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < boardSize; i++) {
      diagonal1.push(i * boardSize + i);
      diagonal2.push(i * boardSize + (boardSize - 1 - i));
    }
    combinations.push({ combo: diagonal1, type: 'diagonal', class: 'diagonal-1' });
    combinations.push({ combo: diagonal2, type: 'diagonal', class: 'diagonal-2' });

    return combinations;
  };

  const makeAIMove = async () => {
  setIsLoading(true);
  try {
    // Add delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await fetch('http://localhost:9000/findBestMove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        cellSize: boardSize,
        board 
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    if (data.bestMove !== -1) {
      handleMove(data.bestMove);
    }
  } catch (error) {
    console.error('AI move error:', error);
    setGameStatus(GAME_STATES.ERROR);
  } finally {
    setIsLoading(false);
  }
};


  const checkWinner = (boardState, player) => {
    const combinations = getWinningCombinations();
    for (const { combo, type, class: className } of combinations) {
      if (combo.every(index => boardState[index] === player)) {
        setWinningLine({ type, className });
        setWinningCells(combo);
        return true;
      }
    }
    return false;
  };

  const handleMove = (index) => {
    if (board[index] || gameStatus !== GAME_STATES.PLAYING) return;

    const newBoard = [...board];
    const currentSymbol = PLAYERS[currentPlayer];
    newBoard[index] = currentSymbol;
    setBoard(newBoard);

    if (checkWinner(newBoard, currentSymbol)) {
      setGameStatus(GAME_STATES.WIN);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameStatus(GAME_STATES.DRAW);
    } else {
      setCurrentPlayer(currentPlayer === 'HUMAN' ? 'AI' : 'HUMAN');
    }
  };

const getGameStatus = () => {
  switch (gameStatus) {
    case GAME_STATES.PLAYING:
      if (isLoading) {
        return <div className="thinking">AI is thinking</div>;
      }
      return `${currentPlayer === 'HUMAN' ? 'Your' : 'AI\'s'} turn`;
    case GAME_STATES.WIN:
      return `${currentPlayer === 'HUMAN' ? 'You won!' : 'AI won!'}`;
    case GAME_STATES.DRAW:
      return "It's a draw!";
    case GAME_STATES.ERROR:
      return "An error occurred. Please try again.";
    default:
      return '';
  }
};


  const handleNewGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer(firstPlayer);
    setGameStatus(GAME_STATES.PLAYING);
    setWinningLine(null);
    setWinningCells([]);
    setIsLoading(false);
  };

  return (
    <div className="game-container">
      <div className={`status ${isLoading ? 'thinking' : ''}`}>
        {getGameStatus()}
      </div>

      <div className={`board size-${boardSize}`}>
        {board.map((value, index) => (
          <Cell
            key={index}
            value={value}
            onClick={() => currentPlayer === 'HUMAN' && handleMove(index)}
            disabled={
              value !== null || 
              currentPlayer === 'AI' || 
              gameStatus !== GAME_STATES.PLAYING
            }
            isWinning={winningCells.includes(index)}
          />
        ))}
        {winningLine && (
          <div 
            className={`winning-line ${winningLine.type} ${winningLine.class}`}
            aria-label="Winning line"
          />
        )}
      </div>

      <div className="controls">
        <button 
          className="game-button restart" 
          onClick={handleNewGame}
          aria-label="Start new game"
        >
          New Game
        </button>
        <button 
          className="game-button change-player" 
          onClick={onRestart}
          aria-label="Change players"
        >
          Change Players
        </button>
      </div>
    </div>
  );
}

export default GameBoard;
