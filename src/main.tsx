import { createRoot } from 'react-dom/client';
import './index.css';
import InitiativeTracker from './components/InitiativeTracker';
import '@logseq/libs';

interface Combatant {
  name: string;
  initiative: number;
  damage: number;
}

function parseInitiativeTable(content: string): { combatants: Combatant[]; round: number } {
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

const main = () => {
  logseq.UI.showMsg('Odyssey plugin loaded');

  logseq.provideStyle(`
    .initiative-tracker-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .initiative-tracker {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: var(--ls-primary-text-color);
      background-color: var(--ls-primary-background-color);
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 450px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
    }

    .initiative-tracker h2 {
      margin: 0 0 0.5rem 0;
      text-align: center;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .add-combatant-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .add-combatant-form input {
      padding: 0.75rem;
      border: 1px solid var(--ls-border-color);
      border-radius: 6px;
      background-color: var(--ls-secondary-background-color);
      color: var(--ls-primary-text-color);
      font-size: 1rem;
    }

    .add-combatant-form button {
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 6px;
      background-color: var(--ls-primary-accent-color);
      color: white;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      align-self: flex-start;
    }

    .combatant-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid var(--ls-border-color);
      border-radius: 6px;
    }

    .combatant-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--ls-border-color);
    }

    .combatant-list li:last-child {
      border-bottom: none;
    }

    .controls {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .controls button {
      padding: 0.75rem 1.25rem;
      border: 1px solid var(--ls-border-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    }

    .controls button:first-of-type {
        background-color: var(--ls-primary-accent-color);
        color: white;
        border-color: var(--ls-primary-accent-color);
    }
  `);

  logseq.Editor.registerBlockContextMenuItem('Track Initiative', async (e) => {
    const key = `odyssey-initiative-tracker-${e.uuid}`;
    const block = await logseq.Editor.getBlock(e.uuid);
    let initialCombatants: Combatant[] = [];
    let initialRound = 1;

    if (block && block.content) {
      const parsedData = parseInitiativeTable(block.content);
      initialCombatants = parsedData.combatants;
      initialRound = parsedData.round;
    }

    logseq.provideUI({
      key,
      template: `<div id="${key}"></div>`,
      attrs: {
        title: 'Initiative Tracker',
      },
    });

    // Use a timeout to ensure the UI is rendered before we try to mount the React component
    setTimeout(() => {
      const rootEl = parent.document.getElementById(key);
      if (rootEl) {
        const reactRoot = createRoot(rootEl);
        reactRoot.render(
          <InitiativeTracker
            initialCombatants={initialCombatants}
            initialRound={initialRound}
            onConfirm={(combatants, round) => {
              const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
              const table = `Round: ${round}\n| Name | Initiative | Damage |\n|---|---|---|\n${sortedCombatants
                .map((c) => `| ${c.name} | ${c.initiative} | ${c.damage} |`)
                .join('\n')}`;
              logseq.Editor.updateBlock(e.uuid, table);
              logseq.provideUI({ key, template: `` }); // Close the UI
            }}
            onCancel={() => {
              logseq.provideUI({ key, template: `` }); // Close the UI
            }}
          />
        );
      }
    }, 0);
  });
};

logseq.ready(main).catch(console.error);
