import React from 'react';

interface ControlsProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onConfirm, onCancel }) => (
  <div className="flex justify-end gap-3">
    <button onClick={onConfirm} className="p-3 border border-ls-border rounded-md cursor-pointer text-base font-medium bg-primary-accent text-white">Confirm</button>
    <button onClick={onCancel} className="p-3 border border-ls-border rounded-md cursor-pointer text-base font-medium">Cancel</button>
  </div>
);

export default Controls;