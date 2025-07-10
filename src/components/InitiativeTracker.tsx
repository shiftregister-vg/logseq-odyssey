import React, { useState, useEffect } from 'react';

interface Combatant {
  name: string;
  initiative: number;
}

interface InitiativeTrackerProps {
  initialCombatants?: Combatant[];
  onConfirm: (combatants: Combatant[]) => void;
  onCancel: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({ initialCombatants, onConfirm, onCancel }) => {
  const [combatants, setCombatants] = useState<Combatant[]>(initialCombatants || []);
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialCombatants) {
      setCombatants(initialCombatants);
    }
  }, [initialCombatants]);

  const handleAddOrUpdateCombatant = () => {
    if (name && initiative) {
      const newCombatant = { name, initiative: parseInt(initiative, 10) };
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
    }
  };

  const handleRemoveCombatant = (indexToRemove: number) => {
    setCombatants(combatants.filter((_, index) => index !== indexToRemove));
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setName('');
      setInitiative('');
    }
  };

  const handleEditCombatant = (indexToEdit: number) => {
    const combatant = combatants[indexToEdit];
    setName(combatant.name);
    setInitiative(combatant.initiative.toString());
    setEditingIndex(indexToEdit);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      handleAddOrUpdateCombatant();
    }
  };

  const handleConfirm = () => {
    onConfirm(combatants);
  };

  return (
    <div className="initiative-tracker-overlay">
      <div className="initiative-tracker">
        <h2>Initiative Tracker</h2>
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
          <button type="button" onClick={handleAddOrUpdateCombatant}>
            {editingIndex !== null ? 'Update Combatant' : 'Add Combatant'}
          </button>
        </form>
        <ul className="combatant-list">
          {combatants.map((combatant, index) => (
            <li key={index} onClick={() => handleEditCombatant(index)}>
              <span>{combatant.name} - {combatant.initiative}</span>
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