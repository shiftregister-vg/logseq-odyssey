import { createRoot } from 'react-dom/client';
import './index.css';
import InitiativeTracker from './components/InitiativeTracker/InitiativeTracker';
import '@logseq/libs';

import { Combatant } from './types';

import { parseInitiativeTable } from './utils';

import './styles/InitiativeTracker.css';

const main = () => {
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
        title: 'Odyssey',
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
