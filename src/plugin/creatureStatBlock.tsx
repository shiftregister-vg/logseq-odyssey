import { BlockCommandCallback } from "@logseq/libs/dist/LSPlugin";
import { createRoot } from "react-dom/client";
import CreatureStatBlock from "../components/CreatureStatBlock/CreatureStatBlock";
import { doc } from "../globals/globals";
import { Creature } from "../types";
import { parseCreatureStatBlock, stringifyCreatureToMarkdown } from "../utils";

export const creatureStatBlock: BlockCommandCallback = async (e) => {
  const key = `odyssey-creature-stat-block-${e.uuid}`;
  const block = await logseq.Editor.getBlock(e.uuid);

  const creatureData: Creature = (block && block.content) ? parseCreatureStatBlock(block.content) : {
    name: 'New Creature',
    type: 'Monstrosity',
    size: 'Medium',
    alignment: 'Neutral',
    armorClass: 10,
    hitPoints: '10',
    speed: { base: 30 },
    abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    challengeRating: '1',
  };

  logseq.provideUI({
    key,
    close: 'outside',
    template: `<div id="${key}"></div>`,
    attrs: { title: 'Creature Editor' },
    style: {
      width: '900px',
      height: '600px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'var(--ls-primary-background-color)',
      color: 'var(--ls-primary-text-color)',
    },
  });

  setTimeout(() => {
    const rootEl = doc.getElementById(key);
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
}
