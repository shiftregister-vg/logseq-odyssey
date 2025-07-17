import { logseq as PL } from '../../package.json';

const d20Icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" />
  <polygon points="12,6 17,15 7,15" />
  <line x1="12" y1="2" x2="12" y2="6"/>
  <line x1="20" y1="17" x2="17" y2="15"/>
  <line x1="4" y1="17" x2="7" y2="15"/>
</svg>`;

export interface OdysseyGlobals {
  pluginID: string;
  menuIcon: string;
  isPluginEnabled: string;
}

export const doc = parent.document;
export const root = doc.documentElement;
export const body = doc.body;

export const globals: OdysseyGlobals = {
  pluginID: PL.id,
  menuIcon: d20Icon,
  isPluginEnabled: 'is-odyssey-enabled',
}

