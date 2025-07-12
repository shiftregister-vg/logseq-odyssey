import { createRoot } from 'react-dom/client';
import './index.css';
import InitiativeTracker from './components/InitiativeTracker/InitiativeTracker';
import CreatureStatBlock from './components/CreatureStatBlock/CreatureStatBlock';
import '@logseq/libs';

import { Combatant, Creature } from './types';

import { parseInitiativeTable, parseCreatureStatBlock, stringifyCreatureToMarkdown } from './utils';

import './styles/InitiativeTracker.css';
import './styles/CreatureStatBlock.css';

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

  logseq.Editor.registerBlockContextMenuItem('Create Stat Block', async (e) => {
    const key = `odyssey-creature-stat-block-${e.uuid}`;
    const block = await logseq.Editor.getBlock(e.uuid);

    const creatureData: Creature = (block && block.content) ? parseCreatureStatBlock(block.content) : {
        name: 'New Creature',
        type: 'Monstrosity',
        size: 'Medium',
        alignment: { moral: 'Neutral', ethical: 'Neutral' },
        armorClass: 10,
        hitPoints: 10,
        speed: { base: 30 },
        abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
        challengeRating: '1/8',
    };

    logseq.provideUI({
      key,
      template: `<div id="${key}"></div>`,
      attrs: {
        title: 'Odyssey Stat Block',
      },
    });

    setTimeout(() => {
      const rootEl = parent.document.getElementById(key);
      if (rootEl) {
        const reactRoot = createRoot(rootEl);
        reactRoot.render(
          <CreatureStatBlock
            initialCreature={creatureData}
            onConfirm={(creature) => {
              const markdown = stringifyCreatureToMarkdown(creature);
              logseq.Editor.updateBlock(e.uuid, markdown);
              logseq.provideUI({ key, template: `` });
            }}
            onCancel={() => {
              logseq.provideUI({ key, template: `` });
            }}
          />
        );
      }
    }, 0);
  });
};

logseq.ready(main).catch(console.error);
