import '@logseq/libs';
import { pluginLoad } from './plugin/plugin';
import { loadWasm } from './lib/wasm-loader';

const main = async () => {
  console.log('Odyssey: plugin loaded')
  loadWasm();
  pluginLoad()
}

logseq.ready(main).catch(console.error);
