import React from 'react';
import '../styles/PlayerSelection.css';

function PlayerSelection({ onStart }) {
  return (
    <div className="player-selection">
      <h2>Who goes first?</h2>
      <div className="selection-buttons">
        <button
          className="selection-button"
          onClick={() => onStart('HUMAN')}
        >
          <span className="icon">👤</span>
          <span>You</span>
        </button>
        <button 
          className="selection-button"
          onClick={() => onStart('AI')}
        >
          <span className="icon">🤖</span>
          <span>AI</span>
        </button>
      </div>
    </div>
  );
}

export default PlayerSelection;
