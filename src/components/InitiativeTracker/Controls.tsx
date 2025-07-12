import React from 'react';

interface ControlsProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onConfirm, onCancel }) => (
  <div className="controls">
    <button onClick={onConfirm}>Confirm</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
);

export default Controls;
