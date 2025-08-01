export interface InitiativeTracker {
  combatants: Combatant[];
  round: number;
}

export interface Combatant {
  name: string;
  initiative: number;
  damage: number;
}

export interface Action {
  name: string;
  description: string;
}

export interface Creature {
  name: string;
  species?: string;
  type: 'Aberration' | 'Beast' | 'Celestial' | 'Construct' | 'Dragon' | 'Elemental' | 'Fey' | 'Fiend' | 'Giant' | 'Humanoid' | 'Monstrosity' | 'Ooze' | 'Plant' | 'Undead' | 'Swarm';
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  alignment: string;
  armorClass: number;
  hitPoints: string;
  speed?: { // Made optional
    base: number;
    burrow?: number;
    climb?: number;
    fly?: number;
    hover?: boolean;
    swim?: number;
  };
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows?: string;
  skills?: string;
  damageVulnerabilities?: string;
  damageResistances?: string;
  damageImmunities?: string;
  conditionImmunities?: string;
  senses?: string;
  languages?: string;
  challengeRating: string;
  proficiencyBonus?: number;
  notes?: string;
  actions?: Action[];
  bonusActions?: Action[];
  reactions?: Action[];
  legendaryActions?: Action[];
  options?: Action[];
  description?: string;
}
