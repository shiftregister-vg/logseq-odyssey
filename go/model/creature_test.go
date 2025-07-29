package model

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreatureFromMarkdown(t *testing.T) {
	tests := []struct {
		name        string
		markdown    string
		expected    Creature
		expectError bool
		assertFuncs []func(t *testing.T, c *Creature)
	}{
		{
			name: "Full creature stat block",
			markdown: `
### Test Creature
Medium humanoid (any race), any alignment
---
| Property | Value |
| :--- | :--- |
| **Armor Class** | 18 |
| **Hit Points** | 100 |
| **Speed** | 30ft. |
| **Saving Throws** | Str +8, Dex +4 |
| **Skills** | Perception +5, Stealth +4 |
| **Damage Vulnerabilities** | cold |
| **Damage Resistances** | fire, lightning |
| **Damage Immunities** | poison |
| **Condition Immunities** | charmed, frightened |
| **Senses** | darkvision 60ft., passive Perception 15 |
| **Languages** | Common, Elvish |
| **Challenge** | 5 (1,800 XP) |
| **Proficiency Bonus** | +3 |
---
| STR | DEX | CON | INT | WIS | CHA |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 20 (+5) | 18 (+4) | 16 (+3) | 14 (+2) | 12 (+1) | 10 (+0) |
---

**ACTIONS**
---
***Multiattack.*** The creature makes two attacks.

***Greatsword.*** *Melee Weapon Attack:* +8 to hit, reach 5ft., one target. *Hit:* 12 (2d6 + 5) slashing damage.

**BONUS ACTIONS**
---
***Aggressive.*** As a bonus action, the creature can move up to its speed toward a hostile creature that it can see.

**REACTIONS**
---
***Parry.*** The creature adds 3 to its AC against one melee attack that would hit it. To do so, the creature must see the attacker and be wielding a melee weapon.

**LEGENDARY ACTIONS**
---
***Attack.*** The creature makes one attack.

**OPTIONS**
---
***Variant: Extra Tough.*** The creature has an extra 20 hit points.

**DESCRIPTION**
---
A test creature for unit tests.

**NOTES**
---
This is a note.
`,
			expected: Creature{
				Name:       "Test Creature",
				Size:       "Medium",
				Type:       "humanoid",
				Species:    "any race",
				Alignment:  "any alignment",
				ArmorClass: 18,
				HitPoints:  "100",
				Speed: struct {
					Base   int  `json:"base"`
					Burrow int  `json:"burrow,omitempty"`
					Climb  int  `json:"climb,omitempty"`
					Fly    int  `json:"fly,omitempty"`
					Hover  bool `json:"hover,omitempty"`
					Swim   int  `json:"swim,omitempty"`
				}{
					Base: 30,
				},
				AbilityScores: struct {
					Strength     int `json:"strength"`
					Dexterity    int `json:"dexterity"`
					Constitution int `json:"constitution"`
					Intelligence int `json:"intelligence"`
					Wisdom       int `json:"wisdom"`
					Charisma     int `json:"charisma"`
				}{
					Strength:     20,
					Dexterity:    18,
					Constitution: 16,
					Intelligence: 14,
					Wisdom:       12,
					Charisma:     10,
				},
				SavingThrows:          "Str +8, Dex +4",
				Skills:                "Perception +5, Stealth +4",
				DamageVulnerabilities: "cold",
				DamageResistances:     "fire, lightning",
				DamageImmunities:      "poison",
				ConditionImmunities:   "charmed, frightened",
				Senses:                "darkvision 60ft., passive Perception 15",
				Languages:             "Common, Elvish",
				ChallengeRating:       "5 (1,800 XP)",
				ProficiencyBonus:      3,
				Actions: []Action{
					{Name: "Multiattack", Description: "The creature makes two attacks."},
					{Name: "Greatsword", Description: "*Melee Weapon Attack:* +8 to hit, reach 5ft., one target. *Hit:* 12 (2d6 + 5) slashing damage."},
				},
				BonusActions: []Action{
					{Name: "Aggressive", Description: "As a bonus action, the creature can move up to its speed toward a hostile creature that it can see."},
				},
				Reactions: []Action{
					{Name: "Parry", Description: "The creature adds 3 to its AC against one melee attack that would hit it. To do so, the creature must see the attacker and be wielding a melee weapon."},
				},
				LegendaryActions: []Action{
					{Name: "Attack", Description: "The creature makes one attack."},
				},
				Options: []Action{
					{Name: "Variant: Extra Tough", Description: "The creature has an extra 20 hit points."},
				},
				Description: "A test creature for unit tests.",
				Notes:       "This is a note.",
			},
		},
		{
			name: "Minimal creature stat block",
			markdown: `
### Minimal Creature
Small beast, unaligned
---
| Property | Value |
| :--- | :--- |
| **Armor Class** | 10 |
| **Hit Points** | 1 |
| **Speed** | 10ft. |
| **Challenge** | 0 (10 XP) |
---
| STR | DEX | CON | INT | WIS | CHA |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 1 (-5) | 1 (-5) | 1 (-5) | 1 (-5) | 1 (-5) | 1 (-5) |
---
`,
			expected: Creature{
				Name:       "Minimal Creature",
				Size:       "Small",
				Type:       "beast",
				Alignment:  "unaligned",
				ArmorClass: 10,
				HitPoints:  "1",
				Speed: struct {
					Base   int  `json:"base"`
					Burrow int  `json:"burrow,omitempty"`
					Climb  int  `json:"climb,omitempty"`
					Fly    int  `json:"fly,omitempty"`
					Hover  bool `json:"hover,omitempty"`
					Swim   int  `json:"swim,omitempty"`
				}{
					Base: 10,
				},
				AbilityScores: struct {
					Strength     int `json:"strength"`
					Dexterity    int `json:"dexterity"`
					Constitution int `json:"constitution"`
					Intelligence int `json:"intelligence"`
					Wisdom       int `json:"wisdom"`
					Charisma     int `json:"charisma"`
				}{
					Strength:     1,
					Dexterity:    1,
					Constitution: 1,
					Intelligence: 1,
					Wisdom:       1,
					Charisma:     1,
				},
				ChallengeRating: "0 (10 XP)",
			},
		},
		{
			name:     "Markdown with only a name",
			markdown: "### Just a Name",
			expected: Creature{Name: "Just a Name", AbilityScores: struct {
				Strength     int `json:"strength"`
				Dexterity    int `json:"dexterity"`
				Constitution int `json:"constitution"`
				Intelligence int `json:"intelligence"`
				Wisdom       int `json:"wisdom"`
				Charisma     int `json:"charisma"`
			}{
				Strength:     10,
				Dexterity:    10,
				Constitution: 10,
				Intelligence: 10,
				Wisdom:       10,
				Charisma:     10,
			}},
			assertFuncs: []func(t *testing.T, c *Creature){
				func(t *testing.T, c *Creature) {
					assert.Equal(t, 10, c.AbilityScores.Strength, "Default strength should be 10")
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var creature Creature
			err := creature.FromMarkdown(tt.markdown)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected.Name, creature.Name)
				assert.Equal(t, tt.expected.Size, creature.Size)
				assert.Equal(t, tt.expected.Type, creature.Type)
				assert.Equal(t, tt.expected.Species, creature.Species)
				assert.Equal(t, tt.expected.Alignment, creature.Alignment)
				assert.Equal(t, tt.expected.ArmorClass, creature.ArmorClass)
				assert.Equal(t, tt.expected.HitPoints, creature.HitPoints)
				assert.Equal(t, tt.expected.Speed.Base, creature.Speed.Base)
				assert.Equal(t, tt.expected.AbilityScores, creature.AbilityScores)
				assert.Equal(t, tt.expected.SavingThrows, creature.SavingThrows)
				assert.Equal(t, tt.expected.Skills, creature.Skills)
				assert.Equal(t, tt.expected.DamageVulnerabilities, creature.DamageVulnerabilities)
				assert.Equal(t, tt.expected.DamageResistances, creature.DamageResistances)
				assert.Equal(t, tt.expected.DamageImmunities, creature.DamageImmunities)
				assert.Equal(t, tt.expected.ConditionImmunities, creature.ConditionImmunities)
				assert.Equal(t, tt.expected.Senses, creature.Senses)
				assert.Equal(t, tt.expected.Languages, creature.Languages)
				assert.Equal(t, tt.expected.ChallengeRating, creature.ChallengeRating)
				assert.Equal(t, tt.expected.ProficiencyBonus, creature.ProficiencyBonus)
				assert.Equal(t, tt.expected.Actions, creature.Actions)
				assert.Equal(t, tt.expected.BonusActions, creature.BonusActions)
				assert.Equal(t, tt.expected.Reactions, creature.Reactions)
				assert.Equal(t, tt.expected.LegendaryActions, creature.LegendaryActions)
				assert.Equal(t, tt.expected.Options, creature.Options)
				assert.Equal(t, tt.expected.Description, creature.Description)
				assert.Equal(t, tt.expected.Notes, creature.Notes)
			}

			if len(tt.assertFuncs) > 0 {
				for _, f := range tt.assertFuncs {
					f(t, &creature)
				}
			}
		})
	}
}

func TestCreatureToMarkdown(t *testing.T) {
	tests := []struct {
		name     string
		creature Creature
		expected string
	}{
		{
			name: "Mister Witch",
			creature: Creature{
				Name:       "Mister Witch",
				Size:       "Medium",
				Type:       "Humanoid",
				Species:    "Elf, Shadar-kai",
				Alignment:  "Chaotic Good",
				ArmorClass: 10,
				HitPoints:  "82 (11d8 + 33)",
				Speed: struct {
					Base   int  `json:"base"`
					Burrow int  `json:"burrow,omitempty"`
					Climb  int  `json:"climb,omitempty"`
					Fly    int  `json:"fly,omitempty"`
					Hover  bool `json:"hover,omitempty"`
					Swim   int  `json:"swim,omitempty"`
				}{
					Base: 30,
				},
				AbilityScores: struct {
					Strength     int `json:"strength"`
					Dexterity    int `json:"dexterity"`
					Constitution int `json:"constitution"`
					Intelligence int `json:"intelligence"`
					Wisdom       int `json:"wisdom"`
					Charisma     int `json:"charisma"`
				}{
					Strength:     14,
					Dexterity:    11,
					Constitution: 16,
					Intelligence: 16,
					Wisdom:       13,
					Charisma:     14,
				},
				SavingThrows:      "INT +5, WIS +3",
				Skills:            "Arcana +5, Deception +4, Perception +3",
				DamageResistances: "necrotic",
				Senses:            "darkvision 60ft., passive Perception 13",
				Languages:         "Common, Elvish, Sylvan",
				ChallengeRating:   "3",
				ProficiencyBonus:  2,
				Actions: []Action{
					{Name: "Multiattack", Description: "Witch makes two Cane attacks."},
					{Name: "Cane", Description: "*Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4 + 2) bludgeoning damage plus 6 (1d12) necrotic damage."},
					{Name: "Spellcasting", Description: "While carrying the *Witchlight watch*, Witch casts one of the following spells, requiring no spell components and using Intelligence as the spellcasting ability (spell save DC 13, + 5 to hit with spell attacks):\n\nAt will: *fire bolt*, *invisibility* (after casting, roll a d8; on a roll of 3 or 8, Witch can't cast the spell again until the next dawn), *message*"},
				},
				BonusActions: []Action{
					{Name: "Blessing of the Raven Queen (1/day)", Description: "Witch magically teleports, along with any equipment he is wearing or carrying, up to 30 feet to an unoccupied space he can see. Until the start of his next turn, he appears ghostly and gains resistance to all damage."},
				},
				Notes: "***Fey Ancestry.*** Witch has advantage on saving throws against being charmed, and magic can't put him to sleep.\n\n***Special Equipment.*** Witch carries and is attuned to the *Witchlight watch*.",
			},
			expected: `
### Mister Witch
Medium Humanoid (Elf, Shadar-kai), Chaotic Good
---
| Property | Value |
| :--- | :--- |
| **Armor Class** | 10 |
| **Hit Points** | 82 (11d8 + 33) |
| **Speed** | 30ft. |
| **Saving Throws** | INT +5, WIS +3 |
| **Skills** | Arcana +5, Deception +4, Perception +3 |
| **Damage Resistances** | necrotic |
| **Senses** | darkvision 60ft., passive Perception 13 |
| **Languages** | Common, Elvish, Sylvan |
| **Challenge** | 3 |
| **Proficiency Bonus** | +2 |
---
| STR | DEX | CON | INT | WIS | CHA |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 14 (+2) | 11 (+0) | 16 (+3) | 16 (+3) | 13 (+1) | 14 (+2) |
---

**ACTIONS**
---
***Multiattack.*** Witch makes two Cane attacks.

***Cane.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4 + 2) bludgeoning damage plus 6 (1d12) necrotic damage.

***Spellcasting.*** While carrying the *Witchlight watch*, Witch casts one of the following spells, requiring no spell components and using Intelligence as the spellcasting ability (spell save DC 13, + 5 to hit with spell attacks):

At will: *fire bolt*, *invisibility* (after casting, roll a d8; on a roll of 3 or 8, Witch can't cast the spell again until the next dawn), *message*

**BONUS ACTIONS**
---
***Blessing of the Raven Queen (1/day).*** Witch magically teleports, along with any equipment he is wearing or carrying, up to 30 feet to an unoccupied space he can see. Until the start of his next turn, he appears ghostly and gains resistance to all damage.

**NOTES**
---
***Fey Ancestry.*** Witch has advantage on saving throws against being charmed, and magic can't put him to sleep.

***Special Equipment.*** Witch carries and is attuned to the *Witchlight watch*.
`,
		},

		{
			name: "Full creature stat block",
			creature: Creature{
				Name:       "Test Creature",
				Size:       "Medium",
				Type:       "humanoid",
				Species:    "any race",
				Alignment:  "any alignment",
				ArmorClass: 18,
				HitPoints:  "100",
				Speed: struct {
					Base   int  `json:"base"`
					Burrow int  `json:"burrow,omitempty"`
					Climb  int  `json:"climb,omitempty"`
					Fly    int  `json:"fly,omitempty"`
					Hover  bool `json:"hover,omitempty"`
					Swim   int  `json:"swim,omitempty"`
				}{
					Base: 30,
				},
				AbilityScores: struct {
					Strength     int `json:"strength"`
					Dexterity    int `json:"dexterity"`
					Constitution int `json:"constitution"`
					Intelligence int `json:"intelligence"`
					Wisdom       int `json:"wisdom"`
					Charisma     int `json:"charisma"`
				}{
					Strength:     20,
					Dexterity:    18,
					Constitution: 16,
					Intelligence: 14,
					Wisdom:       12,
					Charisma:     10,
				},
				SavingThrows:          "Str +8, Dex +4",
				Skills:                "Perception +5, Stealth +4",
				DamageVulnerabilities: "cold",
				DamageResistances:     "fire, lightning",
				DamageImmunities:      "poison",
				ConditionImmunities:   "charmed, frightened",
				Senses:                "darkvision 60ft., passive Perception 15",
				Languages:             "Common, Elvish",
				ChallengeRating:       "5 (1,800 XP)",
				ProficiencyBonus:      3,
				Actions: []Action{
					{Name: "Multiattack", Description: "The creature makes two attacks."},
					{Name: "Greatsword", Description: "*Melee Weapon Attack:* +8 to hit, reach 5ft., one target. *Hit:* 12 (2d6 + 5) slashing damage."},
				},
				BonusActions: []Action{
					{Name: "Aggressive", Description: "As a bonus action, the creature can move up to its speed toward a hostile creature that it can see."},
				},
				Reactions: []Action{
					{Name: "Parry", Description: "The creature adds 3 to its AC against one melee attack that would hit it. To do so, the creature must see the attacker and be wielding a melee weapon."},
				},
				LegendaryActions: []Action{
					{Name: "Attack", Description: "The creature makes one attack."},
				},
				Options: []Action{
					{Name: "Variant: Extra Tough", Description: "The creature has an extra 20 hit points."},
				},
				Description: "A test creature for unit tests.",
				Notes:       "This is a note.",
			},
			expected: `
### Test Creature
Medium humanoid (any race), any alignment
---
| Property | Value |
| :--- | :--- |
| **Armor Class** | 18 |
| **Hit Points** | 100 |
| **Speed** | 30ft. |
| **Saving Throws** | Str +8, Dex +4 |
| **Skills** | Perception +5, Stealth +4 |
| **Damage Vulnerabilities** | cold |
| **Damage Resistances** | fire, lightning |
| **Damage Immunities** | poison |
| **Condition Immunities** | charmed, frightened |
| **Senses** | darkvision 60ft., passive Perception 15 |
| **Languages** | Common, Elvish |
| **Challenge** | 5 (1,800 XP) |
| **Proficiency Bonus** | +3 |
---
| STR | DEX | CON | INT | WIS | CHA |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 20 (+5) | 18 (+4) | 16 (+3) | 14 (+2) | 12 (+1) | 10 (+0) |
---

**ACTIONS**
---
***Multiattack.*** The creature makes two attacks.

***Greatsword.*** *Melee Weapon Attack:* +8 to hit, reach 5ft., one target. *Hit:* 12 (2d6 + 5) slashing damage.

**BONUS ACTIONS**
---
***Aggressive.*** As a bonus action, the creature can move up to its speed toward a hostile creature that it can see.

**REACTIONS**
---
***Parry.*** The creature adds 3 to its AC against one melee attack that would hit it. To do so, the creature must see the attacker and be wielding a melee weapon.

**LEGENDARY ACTIONS**
---
***Attack.*** The creature makes one attack.

**OPTIONS**
---
***Variant: Extra Tough.*** The creature has an extra 20 hit points.

**DESCRIPTION**
---
A test creature for unit tests.

**NOTES**
---
This is a note.
`,
		},
		{
			name: "Minimal creature stat block",
			creature: Creature{
				Name:       "Minimal Creature",
				Size:       "Small",
				Type:       "beast",
				Alignment:  "unaligned",
				ArmorClass: 10,
				HitPoints:  "1",
				Speed: struct {
					Base   int  `json:"base"`
					Burrow int  `json:"burrow,omitempty"`
					Climb  int  `json:"climb,omitempty"`
					Fly    int  `json:"fly,omitempty"`
					Hover  bool `json:"hover,omitempty"`
					Swim   int  `json:"swim,omitempty"`
				}{
					Base: 10,
				},
				AbilityScores: struct {
					Strength     int `json:"strength"`
					Dexterity    int `json:"dexterity"`
					Constitution int `json:"constitution"`
					Intelligence int `json:"intelligence"`
					Wisdom       int `json:"wisdom"`
					Charisma     int `json:"charisma"`
				}{
					Strength:     1,
					Dexterity:    1,
					Constitution: 1,
					Intelligence: 1,
					Wisdom:       1,
					Charisma:     1,
				},
				ChallengeRating: "0 (10 XP)",
			},
			expected: `
### Minimal Creature
Small beast, unaligned
---
| Property | Value |
| :--- | :--- |
| **Armor Class** | 10 |
| **Hit Points** | 1 |
| **Speed** | 10ft. |
| **Challenge** | 0 (10 XP) |
---
| STR | DEX | CON | INT | WIS | CHA |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 1 (-5) | 1 (-5) | 1 (-5) | 1 (-5) | 1 (-5) | 1 (-5) |
---
`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			markdown, err := tt.creature.ToMarkdown()
			assert.NoError(t, err)
			assert.Equal(t, strings.TrimSpace(tt.expected), markdown)
		})
	}
}

func TestGetModifier(t *testing.T) {
	tests := []struct {
		name     string
		score    int
		expected string
	}{
		{name: "Score of 1", score: 1, expected: "-5"},
		{name: "Score of 10", score: 10, expected: "+0"},
		{name: "Score of 20", score: 20, expected: "+5"},
		{name: "Odd score", score: 13, expected: "+1"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, GetModifier(tt.score))
		})
	}
}
