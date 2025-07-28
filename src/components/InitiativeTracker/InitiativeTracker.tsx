import React, { useState, useEffect } from 'react';
import { InitiativeTracker as InitiativeTrackerType, Combatant } from '../../types';
import CombatantList from './CombatantList';
import AddCombatantForm from './AddCombatantForm';
import RoundTracker from './RoundTracker';
import Controls from './Controls';

interface InitiativeTrackerProps {
  initialInitiativeTracker?: InitiativeTrackerType;
  onConfirm: (initiativeTracker: InitiativeTrackerType) => void;
  onCancel: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({ initialInitiativeTracker, onConfirm, onCancel }) => {
  const [initiativeTracker, setInitiativeTracker] = useState<InitiativeTrackerType>(initialInitiativeTracker || { combatants: [], round: 1 });
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [damage, setDamage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialInitiativeTracker) {
      setInitiativeTracker(initialInitiativeTracker);
    }
  }, [initialInitiativeTracker]);

  const handleAddOrUpdateCombatant = () => {
    if (name && initiative) {
      const newCombatant: Combatant = {
        name,
        initiative: parseInt(initiative, 10),
        damage: damage ? parseInt(damage, 10) : 0,
      };
      if (editingIndex !== null) {
        const updatedCombatants = initiativeTracker.combatants.map((c, index) =>
          index === editingIndex ? newCombatant : c
        );
        setInitiativeTracker({ ...initiativeTracker, combatants: updatedCombatants });
        setEditingIndex(null);
      } else {
        setInitiativeTracker({ ...initiativeTracker, combatants: [...initiativeTracker.combatants, newCombatant] });
      }
      setName('');
      setInitiative('');
      setDamage('');
    }
  };

  const handleRemoveCombatant = (indexToRemove: number) => {
    setInitiativeTracker({ ...initiativeTracker, combatants: initiativeTracker.combatants.filter((_, index) => index !== indexToRemove) });
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setName('');
      setInitiative('');
      setDamage('');
    }
  };

  const handleEditCombatant = (indexToEdit: number) => {
    const combatant = initiativeTracker.combatants[indexToEdit];
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
    setInitiativeTracker({ ...initiativeTracker, round: initiativeTracker.round + 1 });
  };

  const handleConfirm = () => {
    onConfirm(initiativeTracker);
  };

  return (
    <div className="p-4 flex flex-col">
      <div className="flex-grow">
        <RoundTracker round={initiativeTracker.round} onNextRound={handleNextRound} />
        <hr />
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
        <hr />
        <CombatantList
          combatants={initiativeTracker.combatants}
          onEdit={handleEditCombatant}
          onRemove={handleRemoveCombatant}
        />
      </div>
      <hr />
      <Controls onConfirm={handleConfirm} onCancel={onCancel} />
    </div>
  );
};

export default InitiativeTracker;
