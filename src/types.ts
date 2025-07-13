export interface Combatant {
  name: string;
  initiative: number;
  damage: number;
}

export interface Creature {
  name: string;
  preName?: string;
  surname?: string;
  type: 'Aberration' | 'Beast' | 'Celestial' | 'Construct' | 'Dragon' | 'Elemental' | 'Fey' | 'Fiend' | 'Giant' | 'Humanoid' | 'Monstrosity' | 'Ooze' | 'Plant' | 'Undead' | 'Swarm';
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  alignment: string;
  personalityTrait?: string;
  armorClass: number;
  hitPoints: number;
  speed: {
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
  actions?: string;
  bonusActions?: string;
  reactions?: string;
  legendaryActions?: string;
  options?: string;
  description?: string;
}
