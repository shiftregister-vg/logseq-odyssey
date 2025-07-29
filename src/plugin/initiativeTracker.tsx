import { BlockCommandCallback } from "@logseq/libs/dist/LSPlugin";
import { createRoot } from "react-dom/client";
import InitiativeTracker from "../components/InitiativeTracker/InitiativeTracker";
import { doc } from "../globals/globals";
import { InitiativeTracker as InitiativeTrackerType } from "../types";
import { parseInitiativeTable } from "../utils";

export const initiativeTracker: BlockCommandCallback = async (e) => {
  const key = `odyssey-initiative-tracker-${e.uuid}`;
  const block = await logseq.Editor.getBlock(e.uuid);
  let initialInitiativeTracker: InitiativeTrackerType = { combatants: [], round: 1 };

  if (block && block.content) {
    initialInitiativeTracker = parseInitiativeTable(block.content);
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
          initialInitiativeTracker={initialInitiativeTracker}
          onConfirm={(initiativeTracker) => {
            const sortedCombatants = [...initiativeTracker.combatants].sort((a, b) => b.initiative - a.initiative);
            const table = `Round: ${initiativeTracker.round}\n| Name | Initiative | Damage |\n|---|---|---|\n${sortedCombatants
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
