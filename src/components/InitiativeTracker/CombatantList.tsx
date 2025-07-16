import React from 'react';
import { Combatant } from '../../types';

interface CombatantListProps {
  combatants: Combatant[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const CombatantList: React.FC<CombatantListProps> = ({ combatants, onEdit, onRemove }) => (
  <ul className="list-none p-0 m-0 max-h-60 overflow-y-auto border border-ls-border rounded-md">
    {combatants.map((combatant, index) => (
      <li key={index} onClick={() => onEdit(index)} className="flex justify-between items-center p-3 border-b border-ls-border last:border-b-0">
        <span>{combatant.name} - Init: {combatant.initiative} - Dmg: {combatant.damage}</span>
        <button onClick={(e) => { e.stopPropagation(); onRemove(index); }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Remove</button>
      </li>
    ))}
  </ul>
);

export default CombatantList;