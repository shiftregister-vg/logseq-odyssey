import React, { useState } from 'react';
import { Creature } from '../../types';

interface CreatureStatBlockProps {
  initialCreature: Creature;
  onConfirm: (creature: Creature) => void;
  onCancel: () => void;
}

const CreatureStatBlock: React.FC<CreatureStatBlockProps> = ({ initialCreature, onConfirm, onCancel }) => {
  const [creature, setCreature] = useState<Creature>(() => {
    const speedData = initialCreature.speed;
    const baseSpeed = speedData?.base !== undefined ? speedData.base : 0;
    const burrowSpeed = speedData?.burrow;
    const climbSpeed = speedData?.climb;
    const flySpeed = speedData?.fly;
    const hoverSpeed = speedData?.hover;
    const swimSpeed = speedData?.swim;

    return {
      ...initialCreature,
      speed: {
        base: baseSpeed,
        burrow: burrowSpeed,
        climb: climbSpeed,
        fly: flySpeed,
        hover: hoverSpeed,
        swim: swimSpeed,
      },
    };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreature(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, category: keyof Creature) => {
    const { name, value } = e.target;
    let parsedValue: string | number | boolean | undefined;

    if (e.target.type === 'number') {
      parsedValue = value !== '' ? parseInt(value, 10) : undefined;
    } else if (e.target.type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else {
      parsedValue = value;
    }

    setCreature(prev => {
      if (category === 'speed') {
        const currentSpeed = prev.speed || { base: 0 }; // Default to an object with base: 0 if prev.speed is undefined

        const updatedSpeed = { ...currentSpeed };

        if (name === 'base') {
          updatedSpeed.base = (parsedValue as number) || 0; // Ensure it's always a number, default to 0
        } else if (name === 'hover') {
          updatedSpeed.hover = parsedValue as boolean;
        } else {
          (updatedSpeed as any)[name] = parsedValue;
        }

        return {
          ...prev,
          speed: updatedSpeed,
        };
      } else if (category === 'abilityScores') {
        return {
          ...prev,
          abilityScores: {
            ...prev.abilityScores,
            [name]: parsedValue as number,
          },
        };
      }
      // Fallback for other nested categories if any
      return {
        ...prev,
        [category]: {
          // @ts-ignore
          ...prev[category],
          [name]: parsedValue,
        },
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="flex flex-col gap-4 text-primary-text bg-primary-bg p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-screen-90 overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <h2 className="m-0 pb-4 border-b border-ls-border">Creature Stat Block</h2>
        <div className="overflow-y-auto flex-grow pr-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="preName" className="font-semibold">Pre-name</label>
                <input id="preName" name="preName" value={creature.preName || ''} onChange={handleChange} placeholder="Pre-name" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-semibold">Name</label>
                <input id="name" name="name" value={creature.name} onChange={handleChange} placeholder="Name" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="surname" className="font-semibold">Surname</label>
                <input id="surname" name="surname" value={creature.surname || ''} onChange={handleChange} placeholder="Surname" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="type" className="font-semibold">Type</label>
                <select id="type" name="type" value={creature.type} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base">
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
              <div className="flex flex-col gap-2">
                <label htmlFor="size" className="font-semibold">Size</label>
                <select id="size" name="size" value={creature.size} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base">
                  <option>Tiny</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                  <option>Huge</option>
                  <option>Gargantuan</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="alignment" className="font-semibold">Alignment</label>
                <select id="alignment" name="alignment" value={creature.alignment} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base">
                  <option>Lawful Good</option>
                  <option>Lawful Neutral</option>
                  <option>Lawful Evil</option>
                  <option>Neutral Good</option>
                  <option>Neutral</option>
                  <option>Neutral Evil</option>
                  <option>Chaotic Good</option>
                  <option>Chaotic Neutral</option>
                  <option>Chaotic Evil</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="personalityTrait" className="font-semibold">Personality Trait</label>
                <input id="personalityTrait" name="personalityTrait" value={creature.personalityTrait || ''} onChange={handleChange} placeholder="Personality Trait" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="armorClass" className="font-semibold">Armor Class</label>
                <input id="armorClass" type="number" name="armorClass" value={creature.armorClass} onChange={handleChange} placeholder="Armor Class" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="hitPoints" className="font-semibold">Hit Points</label>
                <input id="hitPoints" type="number" name="hitPoints" value={creature.hitPoints} onChange={handleChange} placeholder="Hit Points" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Speed</label>
                <div className="grid grid-cols-auto-fit-100 gap-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="baseSpeed" className="font-semibold">Base</label>
                    <input id="baseSpeed" type="number" name="base" value={creature.speed?.base || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Base Speed" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="burrowSpeed" className="font-semibold">Burrow</label>
                    <input id="burrowSpeed" type="number" name="burrow" value={creature.speed?.burrow || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Burrow" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="climbSpeed" className="font-semibold">Climb</label>
                    <input id="climbSpeed" type="number" name="climb" value={creature.speed?.climb || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Climb" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="flySpeed" className="font-semibold">Fly</label>
                    <input id="flySpeed" type="number" name="fly" value={creature.speed?.fly || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Fly" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="swimSpeed" className="font-semibold">Swim</label>
                    <input id="swimSpeed" type="number" name="swim" value={creature.speed?.swim || ''} onChange={(e) => handleNestedChange(e, 'speed')} placeholder="Swim" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="hover-checkbox" className="font-semibold">Hover</label>
                    <input type="checkbox" name="hover" checked={creature.speed?.hover ?? false} onChange={(e) => handleNestedChange(e, 'speed')} id="hover-checkbox" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Ability Scores</label>
                <div className="grid grid-cols-auto-fit-100 gap-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="strength" className="font-semibold">STR</label>
                    <input id="strength" type="number" name="strength" value={creature.abilityScores.strength} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="STR" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="dexterity" className="font-semibold">DEX</label>
                    <input id="dexterity" type="number" name="dexterity" value={creature.abilityScores.dexterity} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="DEX" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="constitution" className="font-semibold">CON</label>
                    <input id="constitution" type="number" name="constitution" value={creature.abilityScores.constitution} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="CON" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="intelligence" className="font-semibold">INT</label>
                    <input id="intelligence" type="number" name="intelligence" value={creature.abilityScores.intelligence} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="INT" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="wisdom" className="font-semibold">WIS</label>
                    <input id="wisdom" type="number" name="wisdom" value={creature.abilityScores.wisdom} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="WIS" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="charisma" className="font-semibold">CHA</label>
                    <input id="charisma" type="number" name="charisma" value={creature.abilityScores.charisma} onChange={(e) => handleNestedChange(e, 'abilityScores')} placeholder="CHA" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="challengeRating" className="font-semibold">Challenge Rating</label>
                <input id="challengeRating" name="challengeRating" value={creature.challengeRating} onChange={handleChange} placeholder="Challenge Rating" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="savingThrows" className="font-semibold">Saving Throws</label>
                <textarea id="savingThrows" name="savingThrows" value={creature.savingThrows || ''} onChange={handleChange} placeholder="e.g. STR +4, DEX +2" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="skills" className="font-semibold">Skills</label>
                <textarea id="skills" name="skills" value={creature.skills || ''} onChange={handleChange} placeholder="e.g. Perception +5, Stealth +7" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="damageVulnerabilities" className="font-semibold">Damage Vulnerabilities</label>
                <textarea id="damageVulnerabilities" name="damageVulnerabilities" value={creature.damageVulnerabilities || ''} onChange={handleChange} placeholder="e.g. Fire, Thunder" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="damageResistances" className="font-semibold">Damage Resistances</label>
                <textarea id="damageResistances" name="damageResistances" value={creature.damageResistances || ''} onChange={handleChange} placeholder="e.g. Bludgeoning, Piercing" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="damageImmunities" className="font-semibold">Damage Immunities</label>
                <textarea id="damageImmunities" name="damageImmunities" value={creature.damageImmunities || ''} onChange={handleChange} placeholder="e.g. Poison, Cold" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="conditionImmunities" className="font-semibold">Condition Immunities</label>
                <textarea id="conditionImmunities" name="conditionImmunities" value={creature.conditionImmunities || ''} onChange={handleChange} placeholder="e.g. Charmed, Frightened" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="senses" className="font-semibold">Senses</label>
                <textarea id="senses" name="senses" value={creature.senses || ''} onChange={handleChange} placeholder="e.g. Darkvision 60ft., Passive Perception 15" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="languages" className="font-semibold">Languages</label>
                <textarea id="languages" name="languages" value={creature.languages || ''} onChange={handleChange} placeholder="e.g. Common, Draconic" className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="actions" className="font-semibold">Actions</label>
                <textarea id="actions" name="actions" value={creature.actions || ''} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="bonusActions" className="font-semibold">Bonus Actions</label>
                <textarea id="bonusActions" name="bonusActions" value={creature.bonusActions || ''} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="reactions" className="font-semibold">Reactions</label>
                <textarea id="reactions" name="reactions" value={creature.reactions || ''} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="legendaryActions" className="font-semibold">Legendary Actions</label>
                <textarea id="legendaryActions" name="legendaryActions" value={creature.legendaryActions || ''} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="options" className="font-semibold">Options</label>
                <textarea id="options" name="options" value={creature.options || ''} onChange={handleChange} className="w-full p-3 bg-secondary-bg text-primary-text border border-ls-border rounded-md text-base min-h-25 resize-y"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-ls-border">
          <button className="px-6 py-3 border-none rounded-md cursor-pointer text-base font-medium bg-secondary-bg text-primary-text border border-ls-border" onClick={onCancel}>Cancel</button>
          <button className="px-6 py-3 border-none rounded-md cursor-pointer text-base font-medium bg-primary-accent text-white" onClick={() => onConfirm(creature)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreatureStatBlock;
