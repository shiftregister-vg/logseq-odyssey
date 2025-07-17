import '@logseq/libs';
import { pluginLoad } from './plugin/plugin';

const main = async () => {
  console.log('Odyssey: plugin loaded')
  pluginLoad()
}

logseq.ready(main).catch(console.error);
