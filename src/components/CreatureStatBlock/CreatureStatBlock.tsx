import React, { useState } from 'react';
import { Creature } from '../../types';

interface CreatureStatBlockProps {
  initialCreature: Creature;
  onConfirm: (creature: Creature) => void;
  onCancel: () => void;
}

const CreatureStatBlock: React.FC<CreatureStatBlockProps> = ({ initialCreature, onConfirm, onCancel }) => {
  const [creature, setCreature] = useState<Creature>(initialCreature);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreature(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, category: keyof Creature) => {
    const { name, value } = e.target;
    setCreature(prev => ({
      ...prev,
      [category]: {
        // @ts-ignore
        ...prev[category],
        [name]: value,
      },
    }));
  };

  return (
    <div className="creature-stat-block-overlay">
      <div className="creature-stat-block">
        <h2>Creature Stat Block</h2>
        <div className="form-grid">
          <input name="preName" value={creature.preName || ''} onChange={handleChange} placeholder="Pre-name" />
          <input name="name" value={creature.name} onChange={handleChange} placeholder="Name" />
          <input name="surname" value={creature.surname || ''} onChange={handleChange} placeholder="Surname" />
          <select name="type" value={creature.type} onChange={handleChange}>
            <option>Aberration</option>
            <option>Beast</option>
            <option>Celestial</option>
            <option>Construct</option>
            <option>Dragon</option>
            <option>Elemental</option>
            <option>Fey</option>
            <option>Fiend</option>
            <option>Giant</option>
            <option>Humanoid</option>
            <option>Monstrosity</option>
            <option>Ooze</option>
            <option>Plant</option>
            <option>Undead</option>
            <option>Swarm</option>
          </select>
          <select name="size" value={creature.size} onChange={handleChange}>
            <option>Tiny</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>Huge</option>
            <option>Gargantuan</option>
          </select>
          <div className="alignment">
            <select name="moral" value={creature.alignment.moral} onChange={(e) => handleNestedChange(e, 'alignment')}>
              <option>Lawful</option>
              <option>Neutral</option>
              <option>Chaotic</option>
            </select>
            <select name="ethical" value={creature.alignment.ethical} onChange={(e) => handleNestedChange(e, 'alignment')}>
              <option>Good</option>
              <option>Neutral</option>
              <option>Evil</option>
            </select>
          </div>
          <input name="personalityTrait" value={creature.personalityTrait || ''} onChange={handleChange} placeholder="Personality Trait" />
          <input type="number" name="armorClass" value={creature.armorClass} onChange={handleChange} placeholder="Armor Class" />
          <input type="number" name="hitPoints" value={creature.hitPoints} onChange={handleChange} placeholder="Hit Points" />
          <div className="speed">
            <input type="number" name="base" value={creature.speed.base} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Base Speed" />
            <input type="number" name="burrow" value={creature.speed.burrow || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Burrow" />
            <input type="number" name="climb" value={creature.speed.climb || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Climb" />
            <input type="number" name="fly" value={creature.speed.fly || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Fly" />
            <label><input type="checkbox" name="hover" checked={creature.speed.hover} onChange={(e) => setCreature(p => ({ ...p, speed: { ...p.speed, hover: e.target.checked } }))} /> Hover</label>
            <input type="number" name="swim" value={creature.speed.swim || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Swim" />
          </div>
          <div className="ability-scores">
            <input type="number" name="strength" value={creature.abilityScores.strength} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="STR" />
            <input type="number" name="dexterity" value={creature.abilityScores.dexterity} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="DEX" />
            <input type="number" name="constitution" value={creature.abilityScores.constitution} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="CON" />
            <input type="number" name="intelligence" value={creature.abilityScores.intelligence} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="INT" />
            <input type="number" name="wisdom" value={creature.abilityScores.wisdom} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="WIS" />
            <input type="number" name="charisma" value={creature.abilityScores.charisma} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="CHA" />
          </div>
          <textarea name="savingThrows" value={creature.savingThrows || ''} onChange={handleChange} placeholder="Saving Throws"></textarea>
          <textarea name="skills" value={creature.skills || ''} onChange={handleChange} placeholder="Skills"></textarea>
          <textarea name="damageVulnerabilities" value={creature.damageVulnerabilities || ''} onChange={handleChange} placeholder="Damage Vulnerabilities"></textarea>
          <textarea name="damageResistances" value={creature.damageResistances || ''} onChange={handleChange} placeholder="Damage Resistances"></textarea>
          <textarea name="damageImmunities" value={creature.damageImmunities || ''} onChange={handleChange} placeholder="Damage Immunities"></textarea>
          <textarea name="conditionImmunities" value={creature.conditionImmunities || ''} onChange={handleChange} placeholder="Condition Immunities"></textarea>
          <textarea name="senses" value={creature.senses || ''} onChange={handleChange} placeholder="Senses"></textarea>
          <textarea name="languages" value={creature.languages || ''} onChange={handleChange} placeholder="Languages"></textarea>
          <input name="challengeRating" value={creature.challengeRating} onChange={handleChange} placeholder="Challenge Rating" />
          <textarea name="actions" value={creature.actions || ''} onChange={handleChange} placeholder="Actions"></textarea>
          <textarea name="bonusActions" value={creature.bonusActions || ''} onChange={handleChange} placeholder="Bonus Actions"></textarea>
          <textarea name="reactions" value={creature.reactions || ''} onChange={handleChange} placeholder="Reactions"></textarea>
          <textarea name="legendaryActions" value={creature.legendaryActions || ''} onChange={handleChange} placeholder="Legendary Actions"></textarea>
          <textarea name="options" value={creature.options || ''} onChange={handleChange} placeholder="Options"></textarea>
        </div>
        <button onClick={() => onConfirm(creature)}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CreatureStatBlock;
