import { BlockCommandCallback } from "@logseq/libs/dist/LSPlugin";
import { createRoot } from "react-dom/client";
import InitiativeTracker from "../components/InitiativeTracker/InitiativeTracker";
import { doc } from "../globals/globals";
import { Combatant } from "../types";
import { parseInitiativeTable } from "../utils";

export const initiativeTracker: BlockCommandCallback = async (e) => {
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
    attrs: { title: 'Track Initiative' },
    style: {
      width: '600px',
      height: '700px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'var(--ls-primary-background-color)',
      color: 'var(--ls-primary-text-color)',
    },
  });

  // Use a timeout to ensure the UI is rendered before we try to mount the React component
  setTimeout(() => {
    const rootEl = doc.getElementById(key);
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
}
