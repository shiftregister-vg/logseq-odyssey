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

    if (lines.length > 0) {
        const roundMatch = lines[0].match(/Round: (\d+)/);
        if (roundMatch && roundMatch[1]) {
            round = parseInt(roundMatch[1], 10);
        }
    }

    let startIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('| Name | Initiative | Damage |') && i + 1 < lines.length && lines[i + 1].includes('|---|---|---|')) {
            startIndex = i + 2;
            break;
        }
    }

    if (startIndex === -1) {
        return { combatants: [], round: 1 };
    }

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
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
            break;
        }
    }
    return { combatants, round };
}

export function parseCreatureStatBlock(content: string): Creature {
    const creature: Partial<Creature> = {
        abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    };

    const lines = content.split('\n');
    let currentSection: string | null = null;
    let sectionContent: string[] = [];
    let justSawHeader = false; // Flag to track if the last line was a section header

    const processSection = () => {
        if (currentSection && sectionContent.length > 0) {
            const text = sectionContent.join('\n').trim();
            switch (currentSection) {
                case 'ACTIONS': creature.actions = text; break;
                case 'BONUS ACTIONS': creature.bonusActions = text; break;
                case 'REACTIONS': creature.reactions = text; break;
                case 'LEGENDARY ACTIONS': creature.legendaryActions = text; break;
                case 'OPTIONS': creature.options = text; break;
                case 'DESCRIPTION': creature.description = text; break;
                case 'NOTES': creature.notes = text; break;
            }
        }
        sectionContent = [];
    };

    for (const line of lines) {
        const trimmedLine = line.trim();
        const headerMatch = trimmedLine.match(/^\*\*([A-Z\s]+)\*\*$/);

        if (headerMatch) {
            processSection();
            currentSection = headerMatch[1].trim();
            justSawHeader = true; // Set the flag
            continue;
        }

        if (trimmedLine.startsWith('### ')) {
            processSection();
            currentSection = null;
            creature.name = trimmedLine.substring(4).trim();
            justSawHeader = false;
            continue;
        }

        if (trimmedLine === '---') {
            if (justSawHeader) {
                // This is the separator right after a header. Ignore it.
                justSawHeader = false;
                continue;
            }
            if (currentSection) {
                // This is a separator within a section's content. Keep it.
                sectionContent.push(line);
                justSawHeader = false;
                continue;
            }
            // Otherwise, it's a structural separator between tables. Ignore it.
            justSawHeader = false;
            continue;
        }

        // For any other line, reset the flag and process content
        justSawHeader = false;
        if (currentSection) {
            sectionContent.push(line);
        } else {
            // This part handles the top matter (size, type, etc.)
            // and table parsing is handled separately, so this is fine.
            if (!trimmedLine.startsWith('|')) {
                const typeSizeAlignmentMatch = line.match(/^(Tiny|Small|Medium|Large|Huge|Gargantuan) ([a-zA-Z\s]+(?:\s\(.*\))?)(?:, (.*))?$/);
                if (typeSizeAlignmentMatch) {
                    creature.size = typeSizeAlignmentMatch[1] as Creature['size'];
                    const typeAndSpecies = typeSizeAlignmentMatch[2].split(' (');
                    creature.type = typeAndSpecies[0].trim() as Creature['type'];
                    if (typeAndSpecies[1]) {
                        creature.species = typeAndSpecies[1].slice(0, -1);
                    }
                    if (typeSizeAlignmentMatch[3]) {
                        creature.alignment = typeSizeAlignmentMatch[3].trim();
                    }
                }
            }
        }
    }
    processSection(); // Process the last section

    // Table parsing logic remains the same
    const tableLines = lines.filter(l => l.startsWith('|'));
    let propertyTable: string[] = [];
    let abilityTable: string[] = [];
    let inPropertyTable = false;
    let inAbilityTable = false;

    tableLines.forEach(line => {
        if (line.includes('Property') && line.includes('Value')) {
            inPropertyTable = true;
            inAbilityTable = false;
            propertyTable = [line];
        } else if (line.includes('STR') && line.includes('DEX')) {
            inAbilityTable = true;
            inPropertyTable = false;
            abilityTable = [line];
        } else if (inPropertyTable) {
            propertyTable.push(line);
        } else if (inAbilityTable) {
            abilityTable.push(line);
        }
    });

    if (propertyTable.length > 0) {
        propertyTable.forEach(row => {
            const match = row.match(/^\| \*\*(.*?)\*\* \| (.*) \|$/);
            if (match) {
                const [, property, value] = match;
                switch (property) {
                    case 'Armor Class': creature.armorClass = parseInt(value); break;
                    case 'Hit Points': creature.hitPoints = value; break;
                    case 'Speed':
                        const speedMatch = value.match(/(\d+)ft\.?/);
                        creature.speed = { base: speedMatch ? parseInt(speedMatch[1]) : 0 };
                        break;
                    case 'Saving Throws': creature.savingThrows = value; break;
                    case 'Skills': creature.skills = value; break;
                    case 'Damage Resistances': creature.damageResistances = value; break;
                    case 'Senses': creature.senses = value; break;
                    case 'Languages': creature.languages = value; break;
                    case 'Challenge': creature.challengeRating = value; break;
                    case 'Proficiency Bonus': creature.proficiencyBonus = parseInt(value); break;
                }
            }
        });
    }

    if (abilityTable.length > 2) {
        const values = abilityTable[2].split('|').map(s => s.trim()).filter(s => s.length > 0);
        if (values.length >= 6) {
            creature.abilityScores = {
                strength: parseInt(values[0].split(' ')[0]),
                dexterity: parseInt(values[1].split(' ')[0]),
                constitution: parseInt(values[2].split(' ')[0]),
                intelligence: parseInt(values[3].split(' ')[0]),
                wisdom: parseInt(values[4].split(' ')[0]),
                charisma: parseInt(values[5].split(' ')[0]),
            };
        }
    }

    return creature as Creature;
}

export function stringifyCreatureToMarkdown(creature: Creature): string {
    let md = `### ${creature.name || 'Unnamed Creature'}\n`;
    if (creature.size && creature.type && creature.alignment) {
        md += `${creature.size} ${creature.type}${creature.species ? ` (${creature.species})` : ''}, ${creature.alignment}\n`;
    }
    md += `---\n`;

    md += `| Property | Value |\n`;
    md += `| :------- | :---- |\n`;
    if (creature.armorClass) md += `| **Armor Class** | ${creature.armorClass} |\n`;
    if (creature.hitPoints) md += `| **Hit Points** | ${creature.hitPoints} |\n`;

    if (creature.speed) {
        let speedString = `${creature.speed.base || 0}ft.`;
        if (creature.speed.burrow) speedString += `, burrow ${creature.speed.burrow}ft.`;
        if (creature.speed.climb) speedString += `, climb ${creature.speed.climb}ft.`;
        if (creature.speed.fly) speedString += `, fly ${creature.speed.fly}ft.`;
        if (creature.speed.hover) speedString += ` (hover)`;
        if (creature.speed.swim) speedString += `, swim ${creature.speed.swim}ft.`;
        md += `| **Speed** | ${speedString} |\n`;
    }

    if (creature.savingThrows) md += `| **Saving Throws** | ${creature.savingThrows} |\n`;
    if (creature.skills) md += `| **Skills** | ${creature.skills} |\n`;
    if (creature.damageVulnerabilities) md += `| **Damage Vulnerabilities** | ${creature.damageVulnerabilities} |\n`;
    if (creature.damageResistances) md += `| **Damage Resistances** | ${creature.damageResistances} |\n`;
    if (creature.damageImmunities) md += `| **Damage Immunities** | ${creature.damageImmunities} |\n`;
    if (creature.conditionImmunities) md += `| **Condition Immunities** | ${creature.conditionImmunities} |\n`;
    if (creature.senses) md += `| **Senses** | ${creature.senses} |\n`;
    if (creature.languages) md += `| **Languages** | ${creature.languages} |\n`;
    if (creature.challengeRating) md += `| **Challenge** | ${creature.challengeRating} |\n`;
    if (creature.proficiencyBonus) md += `| **Proficiency Bonus** | ${creature.proficiencyBonus} |\n`;
    md += `---\n`;

    if (creature.abilityScores) {
        md += `| STR | DEX | CON | INT | WIS | CHA |\n`;
        md += `| :-: | :-: | :-: | :-: | :-: | :-: |\n`;
        md += `| ${creature.abilityScores.strength} (${getModifier(creature.abilityScores.strength)}) | ${creature.abilityScores.dexterity} (${getModifier(creature.abilityScores.dexterity)}) | ${creature.abilityScores.constitution} (${getModifier(creature.abilityScores.constitution)}) | ${creature.abilityScores.intelligence} (${getModifier(creature.abilityScores.intelligence)}) | ${creature.abilityScores.wisdom} (${getModifier(creature.abilityScores.wisdom)}) | ${creature.abilityScores.charisma} (${getModifier(creature.abilityScores.charisma)}) |\n`;
        md += `---\n`;
    }
    if (creature.actions) md += `\n**ACTIONS**\n---\n${creature.actions}\n`;
    if (creature.bonusActions) md += `\n**BONUS ACTIONS**\n---\n${creature.bonusActions}\n`;
    if (creature.reactions) md += `\n**REACTIONS**\n---\n${creature.reactions}\n`;
    if (creature.legendaryActions) md += `\n**LEGENDARY ACTIONS**\n---\n${creature.legendaryActions}\n`;
    if (creature.options) md += `\n**OPTIONS**\n---\n${creature.options}\n`;
    if (creature.description) md += `\n**DESCRIPTION**\n---\n${creature.description}\n`;
    if (creature.notes) md += `\n**NOTES**\n---\n${creature.notes}\n`;

    return md.trim();
}