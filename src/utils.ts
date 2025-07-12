import { LSPluginUserEvents } from "@logseq/libs/dist/LSPlugin.user";
import React from "react";
import { Combatant } from './types';

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
