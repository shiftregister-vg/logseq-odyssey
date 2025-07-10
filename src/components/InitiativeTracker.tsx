import React, { useState } from 'react';
import './InitiativeTracker.css';

interface Combatant {
  name: string;
  initiative: number;
}

interface InitiativeTrackerProps {
  onConfirm: (combatants: Combatant[]) => void;
  onCancel: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({ onConfirm, onCancel }) => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');

  const handleAddCombatant = () => {
    if (name && initiative) {
      setCombatants([...combatants, { name, initiative: parseInt(initiative, 10) }]);
      setName('');
      setInitiative('');
    }
  };

  const handleConfirm = () => {
    onConfirm(combatants);
  };

  return (
    <div className="initiative-tracker">
      <h2>Initiative Tracker</h2>
      <div className="add-combatant-form">
        <input
          type="text"
          placeholder="Combatant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initiative"
          value={initiative}
          onChange={(e) => setInitiative(e.target.value)}
        />
        <button onClick={handleAddCombatant}>Add Combatant</button>
      </div>
      <ul className="combatant-list">
        {combatants.map((combatant, index) => (
          <li key={index}>
            {combatant.name} - {combatant.initiative}
          </li>
        ))}
      </ul>
      <div className="controls">
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default InitiativeTracker;
