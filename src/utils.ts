import { Combatant, Creature, Action } from "./types";

declare const odysseyWasm: any;

export function parseInitiativeTable(content: string): { combatants: Combatant[]; round: number } {
    const result = odysseyWasm.parseInitiativeTable(content);
    return JSON.parse(result);
}

export function parseCreatureStatBlock(content: string): Creature {
    const result = odysseyWasm.parseCreatureStatBlock(content);
    return JSON.parse(result);
}

export function stringifyCreatureToMarkdown(creature: Creature): string {
    return odysseyWasm.stringifyCreatureToMarkdown(JSON.stringify(creature));
}
