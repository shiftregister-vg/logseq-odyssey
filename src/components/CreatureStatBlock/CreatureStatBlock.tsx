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
        <div className="form-content">
          <div className="form-grid">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="preName">Pre-name</label>
                <input id="preName" name="preName" value={creature.preName || ''} onChange={handleChange} placeholder="Pre-name" />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={creature.name} onChange={handleChange} placeholder="Name" />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <input id="surname" name="surname" value={creature.surname || ''} onChange={handleChange} placeholder="Surname" />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select id="type" name="type" value={creature.type} onChange={handleChange}>
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
              </div>
              <div className="form-group">
                <label htmlFor="size">Size</label>
                <select id="size" name="size" value={creature.size} onChange={handleChange}>
                  <option>Tiny</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                  <option>Huge</option>
                  <option>Gargantuan</option>
                </select>
              </div>
              <div className="form-group">
                <label>Alignment</label>
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
              </div>
              <div className="form-group">
                <label htmlFor="personalityTrait">Personality Trait</label>
                <input id="personalityTrait" name="personalityTrait" value={creature.personalityTrait || ''} onChange={handleChange} placeholder="Personality Trait" />
              </div>
              <div className="form-group">
                <label htmlFor="armorClass">Armor Class</label>
                <input id="armorClass" type="number" name="armorClass" value={creature.armorClass} onChange={handleChange} placeholder="Armor Class" />
              </div>
              <div className="form-group">
                <label htmlFor="hitPoints">Hit Points</label>
                <input id="hitPoints" type="number" name="hitPoints" value={creature.hitPoints} onChange={handleChange} placeholder="Hit Points" />
              </div>
              <div className="form-group">
                <label>Speed</label>
                <div className="speed-grid">
                  <input type="number" name="base" value={creature.speed.base} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Base Speed" />
                  <input type="number" name="burrow" value={creature.speed.burrow || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Burrow" />
                  <input type="number" name="climb" value={creature.speed.climb || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Climb" />
                  <input type="number" name="fly" value={creature.speed.fly || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Fly" />
                  <input type="number" name="swim" value={creature.speed.swim || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Swim" />
                  <div className="checkbox-group">
                    <input type="checkbox" name="hover" checked={creature.speed.hover} onChange={(e) => setCreature(p => ({ ...p, speed: { ...p.speed, hover: e.target.checked } }))} id="hover-checkbox" />
                    <label htmlFor="hover-checkbox">Hover</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Ability Scores</label>
                <div className="ability-scores-grid">
                  <input type="number" name="strength" value={creature.abilityScores.strength} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="STR" />
                  <input type="number" name="dexterity" value={creature.abilityScores.dexterity} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="DEX" />
                  <input type="number" name="constitution" value={creature.abilityScores.constitution} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="CON" />
                  <input type="number" name="intelligence" value={creature.abilityScores.intelligence} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="INT" />
                  <input type="number" name="wisdom" value={creature.abilityScores.wisdom} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="WIS" />
                  <input type="number" name="charisma" value={creature.abilityScores.charisma} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="CHA" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="challengeRating">Challenge Rating</label>
                <input id="challengeRating" name="challengeRating" value={creature.challengeRating} onChange={handleChange} placeholder="Challenge Rating" />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="savingThrows">Saving Throws</label>
                <textarea id="savingThrows" name="savingThrows" value={creature.savingThrows || ''} onChange={handleChange} placeholder="e.g. STR +4, DEX +2"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <textarea id="skills" name="skills" value={creature.skills || ''} onChange={handleChange} placeholder="e.g. Perception +5, Stealth +7"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="damageVulnerabilities">Damage Vulnerabilities</label>
                <textarea id="damageVulnerabilities" name="damageVulnerabilities" value={creature.damageVulnerabilities || ''} onChange={handleChange} placeholder="e.g. Fire, Thunder"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="damageResistances">Damage Resistances</label>
                <textarea id="damageResistances" name="damageResistances" value={creature.damageResistances || ''} onChange={handleChange} placeholder="e.g. Bludgeoning, Piercing"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="damageImmunities">Damage Immunities</label>
                <textarea id="damageImmunities" name="damageImmunities" value={creature.damageImmunities || ''} onChange={handleChange} placeholder="e.g. Poison, Cold"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="conditionImmunities">Condition Immunities</label>
                <textarea id="conditionImmunities" name="conditionImmunities" value={creature.conditionImmunities || ''} onChange={handleChange} placeholder="e.g. Charmed, Frightened"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="senses">Senses</label>
                <textarea id="senses" name="senses" value={creature.senses || ''} onChange={handleChange} placeholder="e.g. Darkvision 60ft., Passive Perception 15"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="languages">Languages</label>
                <textarea id="languages" name="languages" value={creature.languages || ''} onChange={handleChange} placeholder="e.g. Common, Draconic"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="actions">Actions</label>
                <textarea id="actions" name="actions" value={creature.actions || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="bonusActions">Bonus Actions</label>
                <textarea id="bonusActions" name="bonusActions" value={creature.bonusActions || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="reactions">Reactions</label>
                <textarea id="reactions" name="reactions" value={creature.reactions || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="legendaryActions">Legendary Actions</label>
                <textarea id="legendaryActions" name="legendaryActions" value={creature.legendaryActions || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="options">Options</label>
                <textarea id="options" name="options" value={creature.options || ''} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={() => onConfirm(creature)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreatureStatBlock;
