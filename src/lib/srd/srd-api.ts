import { SRDMonster, SRDBackground, SRDClass, SRDEquipment, SRDFeat, SRDRace, SRDSpell } from './srd-types';

const API_BASE_URL = 'https://5e-bits.github.io/data';

async function fetchSRD<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching SRD ${endpoint} data:`, error);
    return [];
  }
}

export async function findMonster(name: string): Promise<SRDMonster | null> {
  const monsters = await fetchSRD<SRDMonster>('monsters');
  return monsters.find(m => m.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function findBackground(name: string): Promise<SRDBackground | null> {
  const backgrounds = await fetchSRD<SRDBackground>('backgrounds');
  return backgrounds.find(b => b.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function findClass(name: string): Promise<SRDClass | null> {
  const classes = await fetchSRD<SRDClass>('classes');
  return classes.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function findEquipment(name: string): Promise<SRDEquipment | null> {
  const equipment = await fetchSRD<SRDEquipment>('equipment');
  return equipment.find(e => e.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function findFeat(name: string): Promise<SRDFeat | null> {
  const feats = await fetchSRD<SRDFeat>('feats');
  return feats.find(f => f.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function findRace(name: string): Promise<SRDRace | null> {
  const races = await fetchSRD<SRDRace>('races');
  return races.find(r => r.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function findSpell(name: string): Promise<SRDSpell | null> {
  const spells = await fetchSRD<SRDSpell>('spells');
  return spells.find(s => s.name.toLowerCase() === name.toLowerCase()) || null;
}
