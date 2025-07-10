import React, { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCombatant();
  };

  const handleConfirm = () => {
    onConfirm(combatants);
  };

  return (
    <div className="initiative-tracker-overlay">
      <div className="initiative-tracker">
        <h2>Initiative Tracker</h2>
        <form className="add-combatant-form" onSubmit={handleSubmit}>
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
          <button type="submit">Add Combatant</button>
        </form>
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
    </div>
  );
};

export default InitiativeTracker;
