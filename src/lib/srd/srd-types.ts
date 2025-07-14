export interface SRDMonster {
  id: string;
  name: string;
  size: string;
  type: string;
  subtype: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: string;
  speed: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: {
    [key: string]: number;
  };
  damage_vulnerabilities: string;
  damage_resistances: string;
  damage_immunities: string;
  condition_immunities: string;
  senses: string;
  languages: string;
  challenge_rating: number;
  special_abilities: SRDAction[];
  actions: SRDAction[];
  legendary_actions: SRDAction[];
}

export interface SRDAction {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage_dice?: string;
  damage_bonus?: number;
}

export interface SRDBackground {
  id: string;
  name: string;
  skill_proficiencies: string;
  tool_proficiencies: string;
  languages: string;
  equipment: string;
  feature: {
    name: string;
    desc: string;
  };
  personality_traits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export interface SRDClass {
  id: string;
  name: string;
  hit_die: number;
  proficiencies: {
    armor: string;
    weapons: string;
    tools: string;
    saving_throws: string;
    skills: string;
  };
  equipment: string;
  class_levels: {
    level: number;
    ability_score_bonuses: number;
    prof_bonus: number;
    features: {
        name: string;
        desc: string;
    }[];
    class_specific: any;
  }[];
  subclasses: {
    id: string;
    name: string;
    flavor: string;
    features: {
        name: string;
        desc: string;
        level: number;
    }[];
  }[];
}

export interface SRDEquipment {
    id: string;
    name: string;
    type: string;
    cost?: string;
    weight?: string;
    damage?: string;
    damage_type?: string;
    properties?: string[];
    armor_class?: string;
    strength_requirement?: number;
    stealth_disadvantage?: boolean;
}

export interface SRDFeat {
  id: string;
  name: string;
  prerequisite: string;
  description: string;
}

export interface SRDRace {
  id: string;
  name: string;
  speed: string;
  ability_bonuses: {
    [key: string]: number;
  };
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: string;
  languages: string;
  language_desc: string;
  traits: {
    name: string;
    desc: string;
  }[];
  subraces: {
    id: string;
    name: string;
    desc: string;
    ability_bonuses: {
        [key: string]: number;
    };
    starting_proficiencies: string;
    languages: string;
    racial_traits: {
        name: string;
        desc: string;
    }[];
  }[];
}

export interface SRDSpell {
  id: string;
  name: string;
  desc: string;
  higher_level: string;
  range: string;
  components: string;
  material: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  school: string;
  class: string;
}
