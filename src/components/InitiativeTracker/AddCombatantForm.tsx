import React from 'react';

interface AddCombatantFormProps {
  name: string;
  initiative: string;
  damage: string;
  editingIndex: number | null;
  onNameChange: (name: string) => void;
  onInitiativeChange: (initiative: string) => void;
  onDamageChange: (damage: string) => void;
  onAddOrUpdate: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AddCombatantForm: React.FC<AddCombatantFormProps> = ({
  name,
  initiative,
  damage,
  editingIndex,
  onNameChange,
  onInitiativeChange,
  onDamageChange,
  onAddOrUpdate,
  onKeyPress,
}) => (
  <form className="add-combatant-form" onSubmit={(e) => e.preventDefault()}>
    <input
      type="text"
      placeholder="Combatant Name"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
    <input
      type="number"
      placeholder="Initiative"
      value={initiative}
      onChange={(e) => onInitiativeChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
    <input
      type="number"
      placeholder="Damage"
      value={damage}
      onChange={(e) => onDamageChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
    <button type="button" onClick={onAddOrUpdate}>
      {editingIndex !== null ? 'Update Combatant' : 'Add Combatant'}
    </button>
  </form>
);

export default AddCombatantForm;
