import React from 'react';

const PaletteDisplay = ({ palette }) => {
  if (!palette || palette.length === 0) return null;

  return (
    <div className="palette-grid">
      {palette.map((color, index) => (
        <div
          key={index}
          className="color-box"
          style={{ backgroundColor: color }}
        >
          <span>{color}</span>
        </div>
      ))}
    </div>
  );
};

export default PaletteDisplay;
