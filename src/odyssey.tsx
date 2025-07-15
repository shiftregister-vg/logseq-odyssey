import { createRoot } from 'react-dom/client';
import InitiativeTracker from './components/InitiativeTracker/InitiativeTracker';
import CreatureStatBlock from './components/CreatureStatBlock/CreatureStatBlock';
import SRDLookup from './components/SRDLookup/SRDLookup';
import '@logseq/libs';

import { Combatant, Creature } from './types';

import { parseInitiativeTable, parseCreatureStatBlock, stringifyCreatureToMarkdown } from './utils';

const d20Icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" />
  <polygon points="12,6 17,15 7,15" />
  <line x1="12" y1="2" x2="12" y2="6"/>
  <line x1="20" y1="17" x2="17" y2="15"/>
  <line x1="4" y1="17" x2="7" y2="15"/>
</svg>`;

const model = {
  openSRDLookup(e: any) {
    const { left, top, rect } = e.target.getBoundingClientRect();
    const key = 'odyssey-srd-lookup-ui';
    logseq.provideUI({
      key,
      template: `<div id="${key}"></div>`,
      style: {
        left: `${left - rect.width}px`,
        top: `${top + rect.height}px`,
        width: '200px',
      },
      attrs: {
        title: 'SRD Lookup',
      },
    });

    setTimeout(() => {
      const rootEl = parent.document.getElementById(key);
      if (rootEl) {
        const reactRoot = createRoot(rootEl);
        reactRoot.render(<SRDLookup />);
      }
    }, 0);
  },
};

const main = () => {
  logseq.App.registerUIItem('toolbar', {
    key: 'odyssey-srd-lookup',
    template: `<a data-on-click="openSRDLookup" class="button">${d20Icon}</a>`,
  });

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

  logseq.Editor.registerBlockContextMenuItem('Creature Stat Block', async (e) => {
    const key = `odyssey-creature-stat-block-${e.uuid}`;
    const block = await logseq.Editor.getBlock(e.uuid);

    const creatureData: Creature = (block && block.content) ? parseCreatureStatBlock(block.content) : {
      name: 'New Creature',
      type: 'Monstrosity',
      size: 'Medium',
      alignment: 'Neutral',
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

logseq.ready(model, main).catch(console.error);