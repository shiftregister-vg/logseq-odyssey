import React, { useState, useEffect } from 'react';

interface Combatant {
  name: string;
  initiative: number;
  damage: number;
}

interface InitiativeTrackerProps {
  initialCombatants?: Combatant[];
  initialRound?: number;
  onConfirm: (combatants: Combatant[], round: number) => void;
  onCancel: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({ initialCombatants, initialRound, onConfirm, onCancel }) => {
  const [combatants, setCombatants] = useState<Combatant[]>(initialCombatants || []);
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [damage, setDamage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [round, setRound] = useState(initialRound || 1);

  useEffect(() => {
    if (initialCombatants) {
      setCombatants(initialCombatants);
    }
    if (initialRound) {
      setRound(initialRound);
    }
  }, [initialCombatants, initialRound]);

  const handleAddOrUpdateCombatant = () => {
    if (name && initiative) {
      const newCombatant: Combatant = {
        name,
        initiative: parseInt(initiative, 10),
        damage: damage ? parseInt(damage, 10) : 0,
      };
      if (editingIndex !== null) {
        // Update existing combatant
        const updatedCombatants = combatants.map((c, index) =>
          index === editingIndex ? newCombatant : c
        );
        setCombatants(updatedCombatants);
        setEditingIndex(null);
      } else {
        // Add new combatant
        setCombatants([...combatants, newCombatant]);
      }
      setName('');
      setInitiative('');
      setDamage('');
    }
  };

  const handleRemoveCombatant = (indexToRemove: number) => {
    setCombatants(combatants.filter((_, index) => index !== indexToRemove));
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setName('');
      setInitiative('');
      setDamage('');
    }
  };

  const handleEditCombatant = (indexToEdit: number) => {
    const combatant = combatants[indexToEdit];
    setName(combatant.name);
    setInitiative(combatant.initiative.toString());
    setDamage(combatant.damage.toString());
    setEditingIndex(indexToEdit);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      handleAddOrUpdateCombatant();
    }
  };

  const handleNextRound = () => {
    setRound(prev => prev + 1);
  };

  const handlePreviousRound = () => {
    setRound(prev => Math.max(1, prev - 1));
  };

  const handleConfirm = () => {
    onConfirm(combatants, round);
  };

  return (
    <div className="initiative-tracker-overlay">
      <div className="initiative-tracker">
        <h2>Initiative Tracker</h2>
        <div className="round-controls">
          <button onClick={handlePreviousRound}>Previous Round</button>
          <span>Round: {round}</span>
          <button onClick={handleNextRound}>Next Round</button>
        </div>
        <form className="add-combatant-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Combatant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="number"
            placeholder="Initiative"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="number"
            placeholder="Damage"
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button type="button" onClick={handleAddOrUpdateCombatant}>
            {editingIndex !== null ? 'Update Combatant' : 'Add Combatant'}
          </button>
        </form>
        <ul className="combatant-list">
          {combatants.map((combatant, index) => (
            <li key={index} onClick={() => handleEditCombatant(index)}>
              <span>{combatant.name} - Init: {combatant.initiative} - Dmg: {combatant.damage}</span>
              <button onClick={(e) => { e.stopPropagation(); handleRemoveCombatant(index); }}>Remove</button>
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
