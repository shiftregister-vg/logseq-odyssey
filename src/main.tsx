import { createRoot } from 'react-dom/client';
import './index.css';
import InitiativeTracker from './components/InitiativeTracker';
import '@logseq/libs';

const main = () => {
  logseq.UI.showMsg('Odyssey plugin loaded');

  logseq.Editor.registerBlockContextMenuItem('Track Initiative', async (e) => {
    const key = `odyssey-initiative-tracker-${e.uuid}`;

    logseq.provideUI({
      key,
      template: `<div id="${key}"></div>`,
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        padding: '1rem',
        backgroundColor: 'var(--ls-primary-background-color)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: '1000',
      },
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
            onConfirm={(combatants) => {
              const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
              const table = `| Name | Initiative |\n|---|---|\n${sortedCombatants
                .map((c) => `| ${c.name} | ${c.initiative} |`)
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