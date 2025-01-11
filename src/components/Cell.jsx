import React from 'react';

function Cell({ value, onClick, disabled, isWinning }) {
  return (
    <button 
      className={`cell ${value ? 'taken' : ''} 
                      ${disabled ? 'disabled' : ''} 
                      ${isWinning ? 'winning' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{ position: 'relative', zIndex: 2 }}
      aria-label={value ? `Cell with ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

export default Cell;
