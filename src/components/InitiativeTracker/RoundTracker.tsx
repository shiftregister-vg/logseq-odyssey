import React from 'react';

interface RoundTrackerProps {
  round: number;
  onNextRound: () => void;
}

const RoundTracker: React.FC<RoundTrackerProps> = ({ round, onNextRound }) => (
  <div className="controls">
    <span>Current Round: {round}</span>
    <button onClick={onNextRound}>Start Next Round</button>
  </div>
);

export default RoundTracker;
