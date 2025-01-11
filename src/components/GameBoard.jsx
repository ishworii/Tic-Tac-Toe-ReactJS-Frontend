// src/components/GameBoard.jsx
import React, { useEffect, useState } from 'react';
import '../styles/GameBoard.css';
import Cell from './Cell';

const WINNING_COMBINATIONS = [
  { combo: [0, 1, 2], type: 'horizontal', class: 'row-0' },
  { combo: [3, 4, 5], type: 'horizontal', class: 'row-1' },
  { combo: [6, 7, 8], type: 'horizontal', class: 'row-2' },
  { combo: [0, 3, 6], type: 'vertical', class: 'col-0' },
  { combo: [1, 4, 7], type: 'vertical', class: 'col-1' },
  { combo: [2, 5, 8], type: 'vertical', class: 'col-2' },
  { combo: [0, 4, 8], type: 'diagonal', class: 'diagonal-1' },
  { combo: [2, 4, 6], type: 'diagonal', class: 'diagonal-2' },
];

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

function GameBoard({ firstPlayer, onRestart }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState(firstPlayer);
    const [gameStatus, setGameStatus] = useState(GAME_STATES.PLAYING);
    const [isLoading, setIsLoading] = useState(false);
    const [winningLine, setWinningLine] = useState(null);
    const [winningCells, setWinningCells] = useState([]);

    const handleNewGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer(firstPlayer);
        setGameStatus(GAME_STATES.PLAYING);
        setWinningLine(null);
        setWinningCells([]);
    setIsLoading(false);
    };

  useEffect(() => {
    if (currentPlayer === 'AI' && gameStatus === GAME_STATES.PLAYING) {
      makeAIMove();
    }
  }, [currentPlayer, gameStatus]);

  const makeAIMove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:9000/findBestMove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board }),
      });

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
    for (const { combo, type, class: className } of WINNING_COMBINATIONS) {
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
        return isLoading ? 'AI is thinking...' : `${currentPlayer === 'HUMAN' ? 'Your' : 'AI\'s'} turn`;
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

  return (
    <div className="game-container">
      <div className={`status ${isLoading ? 'thinking' : ''}`}>
       {getGameStatus()}
      </div>

      <div className="board">
        {board.map((value, index) => (
          <Cell
            key={index}
            value={value}
           onClick={() => currentPlayer === 'HUMAN' && handleMove(index)}
            disabled={value !== null || currentPlayer === 'AI' || gameStatus !== GAME_STATES.PLAYING}
            isWinning={winningCells.includes(index)}
          />
       ))}
        {winningLine && (
          <div className={`winning-line ${winningLine.type} ${winningLine.class}`} />
        )}
      </div>

      <div className="controls">
        <button className="game-button restart" onClick={handleNewGame}>
          New Game
        </button>
        <button className="game-button change-player" onClick={onRestart}>
          Change Players
        </button>
      </div>
    </div>
 );
}

export default GameBoard;
