import React, { useState } from 'react';
import { Palette } from 'lucide-react';

function ColorPicker({ selectedColor, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div
          className="size-4 rounded"
          style={{ backgroundColor: selectedColor }}
        />
        <Palette size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className="size-8 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;