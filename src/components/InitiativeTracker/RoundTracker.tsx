import React from 'react';

interface RoundTrackerProps {
  round: number;
  onNextRound: () => void;
}

const RoundTracker: React.FC<RoundTrackerProps> = ({ round, onNextRound }) => (
  <div className="flex justify-end gap-3">
    <span>Current Round: {round}</span>
    <button onClick={onNextRound} className="p-3 border border-ls-border rounded-md cursor-pointer text-base font-medium">Start Next Round</button>
  </div>
);

export default RoundTracker;