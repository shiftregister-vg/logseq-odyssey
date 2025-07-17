import '@logseq/libs';

import { body, globals } from '../globals/globals';
import { toolbar } from './toolbar';
import { initiativeTracker } from './initiativeTracker';
import { creatureStatBlock } from './creatureStatBlock';

export const pluginLoad = () => {
  body.classList.add(globals.isPluginEnabled);
  registerPlugin();

  setTimeout(() => {
    // listen for plugin unload
    logseq.beforeunload(async () => {
      pluginUnload();
    })
  }, 2000);
};

const pluginUnload = () => {
  body.classList.remove(globals.isPluginEnabled);
}

const registerPlugin = async () => {
  logseq.App.registerUIItem('toolbar', toolbar());

  logseq.Editor.registerBlockContextMenuItem('Track Initiative', initiativeTracker);

  logseq.Editor.registerBlockContextMenuItem('Creature Stat Block', creatureStatBlock);
}

