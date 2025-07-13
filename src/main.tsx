import { createRoot } from 'react-dom/client';
import './index.css';
import InitiativeTracker from './components/InitiativeTracker/InitiativeTracker';
import CreatureStatBlock from './components/CreatureStatBlock/CreatureStatBlock';
import '@logseq/libs';

import { Combatant, Creature } from './types';

import { parseInitiativeTable, parseCreatureStatBlock, stringifyCreatureToMarkdown } from './utils';

const main = () => {
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

.round-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
`);
  logseq.provideStyle(`
.creature-stat-block-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.creature-stat-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--ls-primary-text-color);
  background-color: var(--ls-primary-background-color);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.creature-stat-block h2 {
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--ls-border-color);
}

.form-content {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 1rem; /* for scrollbar */
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
}

.creature-stat-block input,
.creature-stat-block textarea,
.creature-stat-block select {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--ls-secondary-background-color);
  color: var(--ls-primary-text-color);
  border: 1px solid var(--ls-border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.creature-stat-block textarea {
  min-height: 100px;
  resize: vertical;
}

.speed-grid,
.ability-scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ls-border-color);
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.form-actions .confirm-button {
  background-color: var(--ls-primary-accent-color);
  color: white;
}

.form-actions .cancel-button {
  background-color: var(--ls-secondary-background-color);
  color: var(--ls-primary-text-color);
  border: 1px solid var(--ls-border-color);
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
        alignment: 'Neutral Neutral',
        armorClass: 10,
        hitPoints: 10,
        speed: { base: 30 },
        abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
        challengeRating: '1/8',
    };

    logseq.provideUI({
      key,
      template: `<div id="${key}" class="creature-stat-block-overlay"></div>`,
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
