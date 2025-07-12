import React from 'react';
import { Combatant } from '../../types';

interface CombatantListProps {
  combatants: Combatant[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const CombatantList: React.FC<CombatantListProps> = ({ combatants, onEdit, onRemove }) => (
  <ul className="combatant-list">
    {combatants.map((combatant, index) => (
      <li key={index} onClick={() => onEdit(index)}>
        <span>{combatant.name} - Init: {combatant.initiative} - Dmg: {combatant.damage}</span>
        <button onClick={(e) => { e.stopPropagation(); onRemove(index); }}>Remove</button>
      </li>
    ))}
  </ul>
);

export default CombatantList;
