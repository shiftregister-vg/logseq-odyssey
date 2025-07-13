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
  const creature: Partial<Creature> = { speed: { base: 0 } };

  const lines = content.split('\n');

  let currentSection: 'none' | 'actions' | 'bonusActions' | 'reactions' | 'legendaryActions' | 'options' | 'description' = 'none';

  lines.forEach(line => {
    const cleanLine = line.replace(/^> /, ''); // Remove blockquote indicator

    if (cleanLine.startsWith('### Actions')) {
      currentSection = 'actions';
      return;
    } else if (cleanLine.startsWith('### Bonus Actions')) {
      currentSection = 'bonusActions';
      return;
    } else if (cleanLine.startsWith('### Reactions')) {
      currentSection = 'reactions';
      return;
    } else if (cleanLine.startsWith('### Legendary Actions')) {
      currentSection = 'legendaryActions';
      return;
    } else if (cleanLine.startsWith('### Options')) {
      currentSection = 'options';
      return;
    } else if (cleanLine.startsWith('### Description')) {
      currentSection = 'description';
      return;
    } else if (cleanLine.startsWith('---')) {
      currentSection = 'none'; // Reset section after a separator
      return;
    }

    switch (currentSection) {
      case 'actions':
        creature.actions = (creature.actions || '') + cleanLine + '\n';
        break;
      case 'bonusActions':
        creature.bonusActions = (creature.bonusActions || '') + cleanLine + '\n';
        break;
      case 'reactions':
        creature.reactions = (creature.reactions || '') + cleanLine + '\n';
        break;
      case 'legendaryActions':
        creature.legendaryActions = (creature.legendaryActions || '') + cleanLine + '\n';
        break;
      case 'options':
        creature.options = (creature.options || '') + cleanLine + '\n';
        break;
      case 'description':
        creature.description = (creature.description || '') + cleanLine + '\n';
        break;
      default:
        const nameMatch = cleanLine.match(/^### (.*?)$/);
        if (nameMatch) creature.name = nameMatch[1];

        const typeSizeAlignmentMatch = cleanLine.match(/^(Tiny|Small|Medium|Large|Huge|Gargantuan) (Aberration|Beast|Celestial|Construct|Dragon|Elemental|Fey|Fiend|Giant|Humanoid|Monstrosity|Ooze|Plant|Undead|Swarm), (.*)$/);
        if (typeSizeAlignmentMatch) {
          creature.size = typeSizeAlignmentMatch[1] as Creature['size'];
          creature.type = typeSizeAlignmentMatch[2] as Creature['type'];
          creature.alignment = typeSizeAlignmentMatch[3];
        }
        
        const armorClassMatch = cleanLine.match(/^- \*\*Armor Class\*\* (\d+)/);
        if (armorClassMatch) creature.armorClass = parseInt(armorClassMatch[1]);

        const hitPointsMatch = cleanLine.match(/^- \*\*Hit Points\*\* (\d+)/);
        if (hitPointsMatch) creature.hitPoints = parseInt(hitPointsMatch[1]);

        const speedMatch = cleanLine.match(/^- \*\*Speed\*\* (.*)$/);
        if (speedMatch) {
          const speed: Creature['speed'] = { base: 0 };
          const speedParts = speedMatch[1].split(', ');
          speedParts.forEach(part => {
            if (part.includes('ft')) {
              const ftMatch = part.match(/(\d+)ft/);
              if (ftMatch) {
                if (part.includes('burrow')) {
                  speed.burrow = parseInt(ftMatch[1]);
                } else if (part.includes('climb')) {
                  speed.climb = parseInt(ftMatch[1]);
                } else if (part.includes('fly')) {
                  speed.fly = parseInt(ftMatch[1]);
                } else if (part.includes('swim')) {
                  speed.swim = parseInt(ftMatch[1]);
                } else {
                  speed.base = parseInt(ftMatch[1]);
                }
              }
            }
            if (part.includes('hover')) {
              speed.hover = true;
            }
          });
          creature.speed = speed;
        }

        const abilityScoresMatch = cleanLine.match(/^\| (\d+) \((\S+)\) \| (\d+) \((\S+)\) \| (\d+) \((\S+)\) \| (\d+) \((\S+)\) \| (\d+) \((\S+)\) \| (\d+) \((\S+)\) \|/);
        if (abilityScoresMatch) {
            creature.abilityScores = {
                strength: parseInt(abilityScoresMatch[1]),
                dexterity: parseInt(abilityScoresMatch[3]),
                constitution: parseInt(abilityScoresMatch[5]),
                intelligence: parseInt(abilityScoresMatch[7]),
                wisdom: parseInt(abilityScoresMatch[9]),
                charisma: parseInt(abilityScoresMatch[11]),
            };
        }

        const savingThrowsMatch = cleanLine.match(/^- \*\*Saving Throws\*\* (.*)$/);
        if (savingThrowsMatch) creature.savingThrows = savingThrowsMatch[1];

        const skillsMatch = cleanLine.match(/^- \*\*Skills\*\* (.*)$/);
        if (skillsMatch) creature.skills = skillsMatch[1];

        const damageVulnerabilitiesMatch = cleanLine.match(/^- \*\*Damage Vulnerabilities\*\* (.*)$/);
        if (damageVulnerabilitiesMatch) creature.damageVulnerabilities = damageVulnerabilitiesMatch[1];

        const damageResistancesMatch = cleanLine.match(/^- \*\*Damage Resistances\*\* (.*)$/);
        if (damageResistancesMatch) creature.damageResistances = damageResistancesMatch[1];

        const damageImmunitiesMatch = cleanLine.match(/^- \*\*Damage Immunities\*\* (.*)$/);
        if (damageImmunitiesMatch) creature.damageImmunities = damageImmunitiesMatch[1];

        const conditionImmunitiesMatch = cleanLine.match(/^- \*\*Condition Immunities\*\* (.*)$/);
        if (conditionImmunitiesMatch) creature.conditionImmunities = conditionImmunitiesMatch[1];

        const sensesMatch = cleanLine.match(/^- \*\*Senses\*\* (.*)$/);
        if (sensesMatch) creature.senses = sensesMatch[1];

        const languagesMatch = cleanLine.match(/^- \*\*Languages\*\* (.*)$/);
        if (languagesMatch) creature.languages = languagesMatch[1];

        const challengeRatingMatch = cleanLine.match(/^- \*\*Challenge\*\* (.*)$/);
        if (challengeRatingMatch) creature.challengeRating = challengeRatingMatch[1];
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
  let md = `> ### ${creature.name}\n`;
  md += `> ${creature.size} ${creature.type}, ${creature.alignment}\n`;
  md += `> ---\n`;
  md += `> - **Armor Class** ${creature.armorClass}\n`;
  md += `> - **Hit Points** ${creature.hitPoints}\n`;
  md += `> - **Speed** ${creature.speed.base}ft.`;
  if (creature.speed.burrow) md += `, burrow ${creature.speed.burrow}ft.`;
  if (creature.speed.climb) md += `, climb ${creature.speed.climb}ft.`;
  if (creature.speed.fly) md += `, fly ${creature.speed.fly}ft.`;
  if (creature.speed.hover) md += ` (hover)`;
  if (creature.speed.swim) md += `, swim ${creature.speed.swim}ft.`;
  md += `\n`;
  md += `> ---\n`;
  md += `> | STR | DEX | CON | INT | WIS | CHA |\n`;
  md += `> | :-: | :-: | :-: | :-: | :-: | :-: |\n`;
  md += `> | ${creature.abilityScores.strength} (${getModifier(creature.abilityScores.strength)}) | ${creature.abilityScores.dexterity} (${getModifier(creature.abilityScores.dexterity)}) | ${creature.abilityScores.constitution} (${getModifier(creature.abilityScores.constitution)}) | ${creature.abilityScores.intelligence} (${getModifier(creature.abilityScores.intelligence)}) | ${creature.abilityScores.wisdom} (${getModifier(creature.abilityScores.wisdom)}) | ${creature.abilityScores.charisma} (${getModifier(creature.abilityScores.charisma)}) |\n`;
  md += `> ---\n`;
  if (creature.savingThrows) md += `> - **Saving Throws** ${creature.savingThrows}\n`;
  if (creature.skills) md += `> - **Skills** ${creature.skills}\n`;
  if (creature.damageVulnerabilities) md += `> - **Damage Vulnerabilities** ${creature.damageVulnerabilities}\n`;
  if (creature.damageResistances) md += `> - **Damage Resistances** ${creature.damageResistances}\n`;
  if (creature.damageImmunities) md += `> - **Damage Immunities** ${creature.damageImmunities}\n`;
  if (creature.conditionImmunities) md += `> - **Condition Immunities** ${creature.conditionImmunities}\n`;
  if (creature.senses) md += `> - **Senses** ${creature.senses}\n`;
  if (creature.languages) md += `> - **Languages** ${creature.languages}\n`;
  md += `> - **Challenge** ${creature.challengeRating}\n`;
  md += `> ---\n`;
  if (creature.personalityTrait) md += `> - **Personality Trait** ${creature.personalityTrait}\n`;
  if (creature.actions) md += `> ### Actions\n> ${creature.actions}\n`;
  if (creature.bonusActions) md += `> ### Bonus Actions\n> ${creature.bonusActions}\n`;
  if (creature.reactions) md += `> ### Reactions\n> ${creature.reactions}\n`;
  if (creature.legendaryActions) md += `> ### Legendary Actions\n> ${creature.legendaryActions}\n`;
  if (creature.options) md += `> ### Options\n> ${creature.options}\n`;
  if (creature.description) md += `> ### Description\n> ${creature.description}\n`;

  return md;
}
