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

  lines.forEach(line => {
    const nameMatch = line.match(/^> ### (.*?)$/);
    if (nameMatch) creature.name = nameMatch[1];

    const typeSizeAlignmentMatch = line.match(/^> (Tiny|Small|Medium|Large|Huge|Gargantuan) (Aberration|Beast|Celestial|Construct|Dragon|Elemental|Fey|Fiend|Giant|Humanoid|Monstrosity|Ooze|Plant|Undead|Swarm), (.*)$/);
    if (typeSizeAlignmentMatch) {
      creature.size = typeSizeAlignmentMatch[1] as Creature['size'];
      creature.type = typeSizeAlignmentMatch[2] as Creature['type'];
      creature.alignment = typeSizeAlignmentMatch[3];
    }
    
    
    const armorClassMatch = line.match(/^> - \*\*Armor Class\*\* (\d+)/);
    if (armorClassMatch) creature.armorClass = parseInt(armorClassMatch[1]);

    const hitPointsMatch = line.match(/^> - \*\*Hit Points\*\* (\d+)/);
    if (hitPointsMatch) creature.hitPoints = parseInt(hitPointsMatch[1]);

    const speedMatch = line.match(/^> - \*\*Speed\*\* (.*)$/);
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

    const abilityScoresMatch = line.match(/^> \|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|/);
    if (abilityScoresMatch) {
        creature.abilityScores = {
            strength: parseInt(abilityScoresMatch[1]),
            dexterity: parseInt(abilityScoresMatch[2]),
            constitution: parseInt(abilityScoresMatch[3]),
            intelligence: parseInt(abilityScoresMatch[4]),
            wisdom: parseInt(abilityScoresMatch[5]),
            charisma: parseInt(abilityScoresMatch[6]),
        };
    }

    const savingThrowsMatch = line.match(/^> - \*\*Saving Throws\*\* (.*)$/);
    if (savingThrowsMatch) creature.savingThrows = savingThrowsMatch[1];

    const skillsMatch = line.match(/^> - \*\*Skills\*\* (.*)$/);
    if (skillsMatch) creature.skills = skillsMatch[1];

    const damageVulnerabilitiesMatch = line.match(/^> - \*\*Damage Vulnerabilities\*\* (.*)$/);
    if (damageVulnerabilitiesMatch) creature.damageVulnerabilities = damageVulnerabilitiesMatch[1];

    const damageResistancesMatch = line.match(/^> - \*\*Damage Resistances\*\* (.*)$/);
    if (damageResistancesMatch) creature.damageResistances = damageResistancesMatch[1];

    const damageImmunitiesMatch = line.match(/^> - \*\*Damage Immunities\*\* (.*)$/);
    if (damageImmunitiesMatch) creature.damageImmunities = damageImmunitiesMatch[1];

    const conditionImmunitiesMatch = line.match(/^> - \*\*Condition Immunities\*\* (.*)$/);
    if (conditionImmunitiesMatch) creature.conditionImmunities = conditionImmunitiesMatch[1];

    const sensesMatch = line.match(/^> - \*\*Senses\*\* (.*)$/);
    if (sensesMatch) creature.senses = sensesMatch[1];

    const languagesMatch = line.match(/^> - \*\*Languages\*\* (.*)$/);
    if (languagesMatch) creature.languages = languagesMatch[1];

    const challengeRatingMatch = line.match(/^> - \*\*Challenge\*\* (.*)$/);
    if (challengeRatingMatch) creature.challengeRating = challengeRatingMatch[1];

    const actionsMatch = line.match(/^> ### Actions\n> (.*)$/s);
    if (actionsMatch) creature.actions = actionsMatch[1];

    const bonusActionsMatch = line.match(/^> ### Bonus Actions\n> (.*)$/s);
    if (bonusActionsMatch) creature.bonusActions = bonusActionsMatch[1];

    const reactionsMatch = line.match(/^> ### Reactions\n> (.*)$/s);
    if (reactionsMatch) creature.reactions = reactionsMatch[1];

    const legendaryActionsMatch = line.match(/^> ### Legendary Actions\n> (.*)$/s);
    if (legendaryActionsMatch) creature.legendaryActions = legendaryActionsMatch[1];

    const optionsMatch = line.match(/^> ### Options\n> (.*)$/s);
    if (optionsMatch) creature.options = optionsMatch[1];

  });

  return creature as Creature;
}

export function stringifyCreatureToMarkdown(creature: Creature): string {
  let md = `> ### ${creature.name}\n`;
  md += `> ${creature.size} ${creature.type}, ${creature.alignment}
`;
  md += `>\n`;
  md += `> - **Armor Class** ${creature.armorClass}\n`;
  md += `> - **Hit Points** ${creature.hitPoints}\n`;
  md += `> - **Speed** ${creature.speed.base}ft.`;
  if (creature.speed.burrow) md += `, burrow ${creature.speed.burrow}ft.`;
  if (creature.speed.climb) md += `, climb ${creature.speed.climb}ft.`;
  if (creature.speed.fly) md += `, fly ${creature.speed.fly}ft.`;
  if (creature.speed.hover) md += ` (hover)`;
  if (creature.speed.swim) md += `, swim ${creature.speed.swim}ft.`;
  md += `\n`;
  md += `>\n`;
  md += `>|STR|DEX|CON|INT|WIS|CHA|\n`;
  md += `>|:---:|:---:|:---:|:---:|:---:|:---:|\n`;
  md += `>|${creature.abilityScores.strength}|${creature.abilityScores.dexterity}|${creature.abilityScores.constitution}|${creature.abilityScores.intelligence}|${creature.abilityScores.wisdom}|${creature.abilityScores.charisma}|\n`;
  md += `>\n`;
  if (creature.savingThrows) md += `> - **Saving Throws** ${creature.savingThrows}\n`;
  if (creature.skills) md += `> - **Skills** ${creature.skills}\n`;
  if (creature.damageVulnerabilities) md += `> - **Damage Vulnerabilities** ${creature.damageVulnerabilities}\n`;
  if (creature.damageResistances) md += `> - **Damage Resistances** ${creature.damageResistances}\n`;
  if (creature.damageImmunities) md += `> - **Damage Immunities** ${creature.damageImmunities}\n`;
  if (creature.conditionImmunities) md += `> - **Condition Immunities** ${creature.conditionImmunities}\n`;
  if (creature.senses) md += `> - **Senses** ${creature.senses}\n`;
  if (creature.languages) md += `> - **Languages** ${creature.languages}\n`;
  md += `> - **Challenge** ${creature.challengeRating}\n`;
  md += `>\n`;
  if (creature.actions) md += `> ### Actions\n> ${creature.actions}\n`;
  if (creature.bonusActions) md += `> ### Bonus Actions\n> ${creature.bonusActions}\n`;
  if (creature.reactions) md += `> ### Reactions\n> ${creature.reactions}\n`;
  if (creature.legendaryActions) md += `> ### Legendary Actions\n> ${creature.legendaryActions}\n`;
  if (creature.options) md += `> ### Options\n> ${creature.options}\n`;

  return md;
}
