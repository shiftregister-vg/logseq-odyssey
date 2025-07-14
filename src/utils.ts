import { LSPluginUserEvents } from "@logseq/libs/dist/LSPlugin.user";
import React from "react";
import { Combatant, Creature } from './types';

let _visible = logseq.isMainUIVisible;

function subscribeLogseqEvent<T extends LSPluginUserEvents>(
  eventName: T,
  handler: (...args: any) => void
) {
  logseq.on(eventName, handler);
  return () => {
    logseq.off(eventName, handler);
  };
}

const subscribeToUIVisible = (onChange: () => void) =>
  subscribeLogseqEvent("ui:visible:changed", ({ visible }) => {
    _visible = visible;
    onChange();
  });

export const useAppVisible = () => {
  return React.useSyncExternalStore(subscribeToUIVisible, () => _visible);
};

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function parseInitiativeTable(content: string): { combatants: Combatant[]; round: number } {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const combatants: Combatant[] = [];
  let round = 1;

  // Extract round from the first line if it exists
  const roundMatch = lines[0].match(/Round: (\d+)/);
  if (roundMatch && roundMatch[1]) {
    round = parseInt(roundMatch[1], 10);
  }

  // Look for the header and separator
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('| Name | Initiative | Damage |') && i + 1 < lines.length && lines[i + 1].includes('|---|---|---|')) {
      startIndex = i + 2; // Start parsing from the line after the separator
      break;
    }
  }

  if (startIndex === -1) {
    return { combatants: [], round: 1 }; // No table found
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    // A valid row should start and end with '|' and have at least three parts
    if (line.startsWith('|') && line.endsWith('|')) {
      const parts = line.split('|').map(part => part.trim()).filter(part => part.length > 0);
      if (parts.length >= 3) {
        const name = parts[0];
        const initiative = parseInt(parts[1], 10);
        const damage = parseInt(parts[2], 10);
        if (!isNaN(initiative) && !isNaN(damage)) {
          combatants.push({ name, initiative, damage });
        }
      }
    } else {
      // Stop if we encounter a line that doesn't look like a table row
      break;
    }
  }
  return { combatants, round };
}

export function parseCreatureStatBlock(content: string): Creature {
  const creature: Partial<Creature> = {}; // Initialize as Partial<Creature>

  const lines = content.split('\n');

  let currentSection: 'none' | 'actions' | 'bonusActions' | 'reactions' | 'legendaryActions' | 'options' | 'description' | 'table' = 'none';
  let tableContent: string[] = [];

  lines.forEach(line => {
    if (line.startsWith('### ')) {
      const sectionName = line.substring(4).trim();
      switch (sectionName) {
        case 'Actions':
          currentSection = 'actions';
          break;
        case 'Bonus Actions':
          currentSection = 'bonusActions';
          break;
        case 'Reactions':
          currentSection = 'reactions';
          break;
        case 'Legendary Actions':
          currentSection = 'legendaryActions';
          break;
        case 'Options':
          currentSection = 'options';
          break;
        case 'Description':
          currentSection = 'description';
          break;
        case 'Personality Trait':
          currentSection = 'none'; // Handled inline
          break;
        default:
          currentSection = 'none';
          break;
      }
      if (sectionName !== creature.name) { // Avoid setting name from other headings
        const nameMatch = line.match(/^### (.*?)$/);
        if (nameMatch) creature.name = nameMatch[1];
      }
      return;
    } else if (line.startsWith('---')) {
      if (currentSection === 'table') {
        // Process the table content
        if (tableContent.length > 0) {
          const header = tableContent[0].split('|').map(s => s.trim()).filter(s => s.length > 0);
          if (header.includes('STR') && header.includes('DEX')) {
            // Ability Scores table
            const values = tableContent[2].split('|').map(s => s.trim()).filter(s => s.length > 0);
            creature.abilityScores = {
              strength: parseInt(values[0].split(' ')[0]),
              dexterity: parseInt(values[1].split(' ')[0]),
              constitution: parseInt(values[2].split(' ')[0]),
              intelligence: parseInt(values[3].split(' ')[0]),
              wisdom: parseInt(values[4].split(' ')[0]),
              charisma: parseInt(values[5].split(' ')[0]),
            };
          } else if (header.includes('Property') && header.includes('Value')) {
            // Main stats table
            tableContent.forEach(row => {
              const match = row.match(/^\| \*\*(.*?)\*\* \| (.*) \|$/);
              if (match) {
                const property = match[1];
                const value = match[2];
                switch (property) {
                  case 'Armor Class':
                    creature.armorClass = parseInt(value);
                    break;
                  case 'Hit Points':
                    creature.hitPoints = parseInt(value);
                    break;
                  case 'Speed':
                    const speedMatch = value.match(/(\d+)ft\.?/);
                    creature.speed = { // Initialize speed object here
                      base: speedMatch ? parseInt(speedMatch[1]) : 0,
                      burrow: undefined,
                      climb: undefined,
                      fly: undefined,
                      hover: undefined,
                      swim: undefined
                    };
                    // More complex speed parsing would go here
                    break;
                  case 'Saving Throws':
                    creature.savingThrows = value;
                    break;
                  case 'Skills':
                    creature.skills = value;
                    break;
                  case 'Damage Vulnerabilities':
                    creature.damageVulnerabilities = value;
                    break;
                  case 'Damage Resistances':
                    creature.damageResistances = value;
                    break;
                  case 'Damage Immunities':
                    creature.damageImmunities = value;
                    break;
                  case 'Condition Immunities':
                    creature.conditionImmunities = value;
                    break;
                  case 'Senses':
                    creature.senses = value;
                    break;
                  case 'Languages':
                    creature.languages = value;
                    break;
                  case 'Challenge':
                    creature.challengeRating = value;
                    break;
                }
              }
            });
          }
        }
        tableContent = [];
        currentSection = 'none';
      } else {
        currentSection = 'none'; // Reset section after a separator
      }
      return;
    } else if (line.startsWith('| ') && line.endsWith(' |')) {
      currentSection = 'table';
      tableContent.push(line);
      return;
    }

    switch (currentSection) {
      case 'actions':
        creature.actions = (creature.actions || '') + line + '\n';
        break;
      case 'bonusActions':
        creature.bonusActions = (creature.bonusActions || '') + line + '\n';
        break;
      case 'reactions':
        creature.reactions = (creature.reactions || '') + line + '\n';
        break;
      case 'legendaryActions':
        creature.legendaryActions = (creature.legendaryActions || '') + line + '\n';
        break;
      case 'options':
        creature.options = (creature.options || '') + line + '\n';
        break;
      case 'description':
        creature.description = (creature.description || '') + line + '\n';
        break;
      default:
        const nameMatch = line.match(/^### (.*?)$/);
        if (nameMatch) creature.name = nameMatch[1];

        const typeSizeAlignmentMatch = line.match(/^(Tiny|Small|Medium|Large|Huge|Gargantuan) (Aberration|Beast|Celestial|Construct|Dragon|Elemental|Fey|Fiend|Giant|Humanoid|Monstrosity|Ooze|Plant|Undead|Swarm), (.*)$/);
        if (typeSizeAlignmentMatch) {
          creature.size = typeSizeAlignmentMatch[1] as Creature['size'];
          creature.type = typeSizeAlignmentMatch[2] as Creature['type'];
          creature.alignment = typeSizeAlignmentMatch[3];
        }

        const personalityTraitMatch = line.match(/^### Personality Trait\n(.*)$/s);
        if (personalityTraitMatch) creature.personalityTrait = personalityTraitMatch[1];
        break;
    }

  });

  // Clean up trailing newlines from multiline fields
  if (creature.actions) creature.actions = creature.actions.trim();
  if (creature.bonusActions) creature.bonusActions = creature.bonusActions.trim();
  if (creature.reactions) creature.reactions = creature.reactions.trim();
  if (creature.legendaryActions) creature.legendaryActions = creature.legendaryActions.trim();
  if (creature.options) creature.options = creature.options.trim();
  if (creature.description) creature.description = creature.description.trim();

  return creature as Creature;
}

export function stringifyCreatureToMarkdown(creature: Creature): string {
  let md = `### ${creature.name}\n`;
  md += `${creature.size} ${creature.type}, ${creature.alignment}\n`;
  md += `---\n`;

  // Main properties table
  md += `| Property | Value |\n`;
  md += `| :------- | :---- |\n`;
  md += `| **Armor Class** | ${creature.armorClass} |\n`;
  md += `| **Hit Points** | ${creature.hitPoints} |\n`;

  let speedString = `${creature.speed?.base || 0}ft.`;
  if (creature.speed?.burrow) speedString += `, burrow ${creature.speed.burrow}ft.`;
  if (creature.speed?.climb) speedString += `, climb ${creature.speed.climb}ft.`;
  if (creature.speed?.fly) speedString += `, fly ${creature.speed.fly}ft.`;
  if (creature.speed?.hover) speedString += ` (hover)`;
  if (creature.speed?.swim) speedString += `, swim ${creature.speed.swim}ft.`;
  md += `| **Speed** | ${speedString} |\n`;

  if (creature.savingThrows) md += `| **Saving Throws** | ${creature.savingThrows} |\n`;
  if (creature.skills) md += `| **Skills** | ${creature.skills} |\n`;
  if (creature.damageVulnerabilities) md += `| **Damage Vulnerabilities** | ${creature.damageVulnerabilities} |\n`;
  if (creature.damageResistances) md += `| **Damage Resistances** | ${creature.damageResistances} |\n`;
  if (creature.damageImmunities) md += `| **Damage Immunities** | ${creature.damageImmunities} |\n`;
  if (creature.conditionImmunities) md += `| **Condition Immunities** | ${creature.conditionImmunities} |\n`;
  if (creature.senses) md += `| **Senses** | ${creature.senses} |\n`;
  if (creature.languages) md += `| **Languages** | ${creature.languages} |\n`;
  md += `| **Challenge** | ${creature.challengeRating} |\n`;
  md += `---\n`;

  // Ability scores table
  md += `| STR | DEX | CON | INT | WIS | CHA |\n`;
  md += `| :-: | :-: | :-: | :-: | :-: | :-: |\n`;
  md += `| ${creature.abilityScores.strength} (${getModifier(creature.abilityScores.strength)}) | ${creature.abilityScores.dexterity} (${getModifier(creature.abilityScores.dexterity)}) | ${creature.abilityScores.constitution} (${getModifier(creature.abilityScores.constitution)}) | ${creature.abilityScores.intelligence} (${getModifier(creature.abilityScores.intelligence)}) | ${creature.abilityScores.wisdom} (${getModifier(creature.abilityScores.wisdom)}) | ${creature.abilityScores.charisma} (${getModifier(creature.abilityScores.charisma)}) |\n`;
  md += `---\n`;

  // Other sections
  if (creature.personalityTrait) md += `### Personality Trait\n${creature.personalityTrait}\n`;
  if (creature.actions) md += `### Actions\n${creature.actions}\n`;
  if (creature.bonusActions) md += `### Bonus Actions\n${creature.bonusActions}\n`;
  if (creature.reactions) md += `### Reactions\n${creature.reactions}\n`;
  if (creature.legendaryActions) md += `### Legendary Actions\n${creature.legendaryActions}\n`;
  if (creature.options) md += `### Options\n${creature.options}\n`;
  if (creature.description) md += `### Description\n${creature.description}\n`;

  return md;
}
