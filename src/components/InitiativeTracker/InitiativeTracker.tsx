import React, { useState, useEffect } from 'react';
import './InitiativeTracker.css';
import { Combatant } from '../../types';
import CombatantList from './CombatantList';
import AddCombatantForm from './AddCombatantForm';
import RoundTracker from './RoundTracker';
import Controls from './Controls';

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
        const updatedCombatants = combatants.map((c, index) =>
          index === editingIndex ? newCombatant : c
        );
        setCombatants(updatedCombatants);
        setEditingIndex(null);
      } else {
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
      e.preventDefault();
      handleAddOrUpdateCombatant();
    }
  };

  const handleNextRound = () => {
    setRound(prev => prev + 1);
  };

  const handleConfirm = () => {
    onConfirm(combatants, round);
  };

  return (
    <div id="odyssey-initiative-tracker-component" className="initiative-tracker-overlay">
      <div className="initiative-tracker">
        <h2>Initiative Tracker</h2>
        <RoundTracker round={round} onNextRound={handleNextRound} />
        <AddCombatantForm
          name={name}
          initiative={initiative}
          damage={damage}
          editingIndex={editingIndex}
          onNameChange={setName}
          onInitiativeChange={setInitiative}
          onDamageChange={setDamage}
          onAddOrUpdate={handleAddOrUpdateCombatant}
          onKeyPress={handleKeyPress}
        />
        <CombatantList
          combatants={combatants}
          onEdit={handleEditCombatant}
          onRemove={handleRemoveCombatant}
        />
        <Controls onConfirm={handleConfirm} onCancel={onCancel} />
      </div>
    </div>
  );
};

export default InitiativeTracker;
