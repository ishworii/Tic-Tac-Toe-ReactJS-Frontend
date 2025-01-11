import React, { useState } from 'react';
import '../styles/PlayerSelection.css';

function PlayerSelection({ onStart }) {
  const [selectedSize, setSelectedSize] = useState(3);

  const handleStart = (player) => {
    onStart(player, selectedSize);
  };

  return (
    <div className="player-selection">
      <h2>Game Setup</h2>
      
      <div className="size-selector">
        <label htmlFor="boardSize">Board Size:</label>
        <select 
          id="boardSize" 
          value={selectedSize} 
          onChange={(e) => setSelectedSize(Number(e.target.value))}
        >
          <option value={3}>3 x 3</option>
          <option value={4}>4 x 4</option>
          <option value={5}>5 x 5</option>
        </select>
      </div>

      <h3>Who goes first?</h3>
      <div className="selection-buttons">
        <button onClick={() => handleStart('HUMAN')}>
          <span className="icon">👤</span>
          <span>You</span>
        </button>
        <button onClick={() => handleStart('AI')}>
          <span className="icon">🤖</span>
          <span>AI</span>
        </button>
      </div>
    </div>
  );
}

export default PlayerSelection;
