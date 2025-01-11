// src/App.jsx
import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import PlayerSelection from './components/PlayerSelection';
import './styles/App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState(null);

  const handleGameStart = (player) => {
    setFirstPlayer(player);
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setFirstPlayer(null);
  };

  return (
    <div className="app">
      <h1 className="title">Tic Tac Toe</h1>
      {!gameStarted ? (
        <PlayerSelection onStart={handleGameStart} />
      ) : (
        <GameBoard 
          firstPlayer={firstPlayer} 
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
