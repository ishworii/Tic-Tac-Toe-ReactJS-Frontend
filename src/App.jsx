import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import PlayerSelection from './components/PlayerSelection';
import './styles/App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [boardSize, setBoardSize] = useState(3);

  const handleGameStart = (player, size) => {
    setFirstPlayer(player);
    setBoardSize(size);
    setGameStarted(true);
  };

  return (
    <div className="app">
      <h1 className="title">Tic Tac Toe</h1>
      {!gameStarted ? (
        <PlayerSelection onStart={handleGameStart} />
      ) : (
        <GameBoard 
          firstPlayer={firstPlayer} 
          boardSize={boardSize}
          onRestart={() => setGameStarted(false)}
        />
      )}
    </div>
  );
}

export default App;
