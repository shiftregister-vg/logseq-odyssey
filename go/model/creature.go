package model

import (
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

type Creature struct {
	Name       string `json:"name"`
	Species    string `json:"species,omitempty"`
	Type       string `json:"type"`
	Size       string `json:"size"`
	Alignment  string `json:"alignment"`
	ArmorClass int    `json:"armorClass"`
	HitPoints  string `json:"hitPoints"`
	Speed      struct {
		Base   int  `json:"base"`
		Burrow int  `json:"burrow,omitempty"`
		Climb  int  `json:"climb,omitempty"`
		Fly    int  `json:"fly,omitempty"`
		Hover  bool `json:"hover,omitempty"`
		Swim   int  `json:"swim,omitempty"`
	} `json:"speed,omitempty"`
	AbilityScores struct {
		Strength     int `json:"strength"`
		Dexterity    int `json:"dexterity"`
		Constitution int `json:"constitution"`
		Intelligence int `json:"intelligence"`
		Wisdom       int `json:"wisdom"`
		Charisma     int `json:"charisma"`
	} `json:"abilityScores"`
	SavingThrows          string   `json:"savingThrows,omitempty"`
	Skills                string   `json:"skills,omitempty"`
	DamageVulnerabilities string   `json:"damageVulnerabilities,omitempty"`
	DamageResistances     string   `json:"damageResistances,omitempty"`
	DamageImmunities      string   `json:"damageImmunities,omitempty"`
	ConditionImmunities   string   `json:"conditionImmunities,omitempty"`
	Senses                string   `json:"senses,omitempty"`
	Languages             string   `json:"languages,omitempty"`
	ChallengeRating       string   `json:"challengeRating"`
	ProficiencyBonus      int      `json:"proficiencyBonus,omitempty"`
	Notes                 string   `json:"notes,omitempty"`
	Actions               []Action `json:"actions,omitempty"`
	BonusActions          []Action `json:"bonusActions,omitempty"`
	Reactions             []Action `json:"reactions,omitempty"`
	LegendaryActions      []Action `json:"legendaryActions,omitempty"`
	Options               []Action `json:"options,omitempty"`
	Description           string   `json:"description,omitempty"`
}

func (creature *Creature) FromMarkdown(content string) error {
	creature.AbilityScores.Strength = 10
	creature.AbilityScores.Dexterity = 10
	creature.AbilityScores.Constitution = 10
	creature.AbilityScores.Intelligence = 10
	creature.AbilityScores.Wisdom = 10
	creature.AbilityScores.Charisma = 10

	lines := strings.Split(content, "\n")
	var currentSection string
	var sectionContent []string
	justSawHeader := false

	processSection := func() {
		if currentSection != "" && len(sectionContent) > 0 {
			text := strings.TrimSpace(strings.Join(sectionContent, "\n"))

			switch currentSection {
			case "DESCRIPTION":
				creature.Description = text
				sectionContent = nil
				return
			case "NOTES":
				creature.Notes = text
				sectionContent = nil
				return
			}

			// Split text into paragraphs, then group paragraphs into action blocks.
			paragraphs := strings.Split(text, "\n\n")
			var actionBlocks []string
			var currentBlock string

			for _, p := range paragraphs {
				trimmedP := strings.TrimSpace(p)
				if strings.HasPrefix(trimmedP, "***") && currentBlock != "" {
					actionBlocks = append(actionBlocks, strings.TrimSpace(currentBlock))
					currentBlock = p
				} else {
					if currentBlock == "" {
						currentBlock = p
					} else {
						currentBlock += "\n\n" + p
					}
				}
			}
			if currentBlock != "" {
				actionBlocks = append(actionBlocks, strings.TrimSpace(currentBlock))
			}

			actions := []Action{}
			actionRegex := regexp.MustCompile(`(?s)^\*\*\*(.*?)\*\*\*\s*(.*)`)

			for _, block := range actionBlocks {
				if strings.TrimSpace(block) == "" {
					continue
				}

				match := actionRegex.FindStringSubmatch(block)
				if len(match) > 2 {
					name := strings.TrimSuffix(strings.TrimSpace(match[1]), ".")
					description := strings.TrimSpace(match[2])
					actions = append(actions, Action{Name: name, Description: description})
				}
			}

			if len(actions) > 0 {
				switch currentSection {
				case "ACTIONS":
					creature.Actions = actions
				case "BONUS ACTIONS":
					creature.BonusActions = actions
				case "REACTIONS":
					creature.Reactions = actions
				case "LEGENDARY ACTIONS":
					creature.LegendaryActions = actions
				case "OPTIONS":
					creature.Options = actions
				}
			}
		}
		sectionContent = nil
	}

	for _, line := range lines {
		trimmedLine := strings.TrimSpace(line)
		headerMatch := regexp.MustCompile(`^\*\*([A-Z\s]+)\*\*$`).FindStringSubmatch(trimmedLine)

		if len(headerMatch) > 1 {
			processSection()
			currentSection = strings.TrimSpace(headerMatch[1])
			justSawHeader = true
			continue
		}

		if strings.HasPrefix(trimmedLine, "### ") {
			processSection()
			currentSection = ""
			creature.Name = strings.TrimSpace(strings.TrimPrefix(trimmedLine, "### "))
			justSawHeader = false
			continue
		}

		if trimmedLine == "---" {
			if justSawHeader {
				justSawHeader = false
				continue
			}
			if currentSection != "" {
				sectionContent = append(sectionContent, line)
				justSawHeader = false
				continue
			}
			justSawHeader = false
			continue
		}

		justSawHeader = false
		if currentSection != "" {
			sectionContent = append(sectionContent, line)
		} else {
			if !strings.HasPrefix(trimmedLine, "|") {
				typeSizeAlignmentMatch := regexp.MustCompile(`^(Tiny|Small|Medium|Large|Huge|Gargantuan) ([a-zA-Z\s]+(?:\s\(.*\))?)(?:, (.*))?$`).FindStringSubmatch(line)
				if len(typeSizeAlignmentMatch) > 1 {
					creature.Size = typeSizeAlignmentMatch[1]
					typeAndSpecies := strings.Split(typeSizeAlignmentMatch[2], " (")
					creature.Type = strings.TrimSpace(typeAndSpecies[0])
					if len(typeAndSpecies) > 1 {
						creature.Species = strings.TrimSuffix(typeAndSpecies[1], ")")
					}
					if len(typeSizeAlignmentMatch) > 3 {
						creature.Alignment = strings.TrimSpace(typeSizeAlignmentMatch[3])
					}
				}
			}
		}
	}
	processSection()

	tableLines := []string{}
	for _, line := range lines {
		if strings.HasPrefix(line, "|") {
			tableLines = append(tableLines, line)
		}
	}

	var propertyTable []string
	var abilityTable []string
	inPropertyTable := false
	inAbilityTable := false

	for _, line := range tableLines {
		if strings.Contains(line, "Property") && strings.Contains(line, "Value") {
			inPropertyTable = true
			inAbilityTable = false
			propertyTable = []string{line}
		} else if strings.Contains(line, "STR") && strings.Contains(line, "DEX") {
			inAbilityTable = true
			inPropertyTable = false
			abilityTable = []string{line}
		} else if inPropertyTable {
			propertyTable = append(propertyTable, line)
		} else if inAbilityTable {
			abilityTable = append(abilityTable, line)
		}
	}

	if len(propertyTable) > 0 {
		for _, row := range propertyTable {
			match := regexp.MustCompile(`^\| \*\*(.*?)\*\* \| (.*) \|$`).FindStringSubmatch(row)
			if len(match) > 2 {
				property := match[1]
				value := match[2]
				switch property {
				case "Armor Class":
					creature.ArmorClass, _ = strconv.Atoi(value)
				case "Hit Points":
					creature.HitPoints = value
				case "Speed":
					speedMatch := regexp.MustCompile(`(\d+)ft\\.?`).FindStringSubmatch(value)
					if len(speedMatch) > 1 {
						creature.Speed.Base, _ = strconv.Atoi(speedMatch[1])
					}
				case "Saving Throws":
					creature.SavingThrows = value
				case "Skills":
					creature.Skills = value
				case "Damage Resistances":
					creature.DamageResistances = value
				case "Senses":
					creature.Senses = value
				case "Languages":
					creature.Languages = value
				case "Challenge":
					creature.ChallengeRating = value
				case "Proficiency Bonus":
					creature.ProficiencyBonus, _ = strconv.Atoi(value)
				}
			}
		}
	}

	if len(abilityTable) > 2 {
		values := strings.Split(abilityTable[2], "|")
		var filteredValues []string
		for _, v := range values {
			if strings.TrimSpace(v) != "" {
				filteredValues = append(filteredValues, strings.TrimSpace(v))
			}
		}
		if len(filteredValues) >= 6 {
			creature.AbilityScores.Strength, _ = strconv.Atoi(strings.Fields(filteredValues[0])[0])
			creature.AbilityScores.Dexterity, _ = strconv.Atoi(strings.Fields(filteredValues[1])[0])
			creature.AbilityScores.Constitution, _ = strconv.Atoi(strings.Fields(filteredValues[2])[0])
			creature.AbilityScores.Intelligence, _ = strconv.Atoi(strings.Fields(filteredValues[3])[0])
			creature.AbilityScores.Wisdom, _ = strconv.Atoi(strings.Fields(filteredValues[4])[0])
			creature.AbilityScores.Charisma, _ = strconv.Atoi(strings.Fields(filteredValues[5])[0])
		}
	}

	return nil
}

func (creature *Creature) ToMarkdown() (string, error) {
	md := fmt.Sprintf("### %s\n", creature.Name)
	if creature.Size != "" && creature.Type != "" && creature.Alignment != "" {
		md += fmt.Sprintf("%s %s", creature.Size, creature.Type)
		if creature.Species != "" {
			md += fmt.Sprintf(" (%s)", creature.Species)
		}
		md += fmt.Sprintf(", %s\n", creature.Alignment)
	}
	md += "---\n"

	md += "| Property | Value |\n"
	md += "| :------- | :---- |\n"
	if creature.ArmorClass != 0 {
		md += fmt.Sprintf("| **Armor Class** | %d |\n", creature.ArmorClass)
	}
	if creature.HitPoints != "" {
		md += fmt.Sprintf("| **Hit Points** | %s |\n", creature.HitPoints)
	}

	if creature.Speed.Base != 0 {
		speedString := fmt.Sprintf("%dft.", creature.Speed.Base)
		if creature.Speed.Burrow != 0 {
			speedString += fmt.Sprintf(", burrow %dft.", creature.Speed.Burrow)
		}
		if creature.Speed.Climb != 0 {
			speedString += fmt.Sprintf(", climb %dft.", creature.Speed.Climb)
		}
		if creature.Speed.Fly != 0 {
			speedString += fmt.Sprintf(", fly %dft.", creature.Speed.Fly)
		}
		if creature.Speed.Hover {
			speedString += " (hover)"
		}
		if creature.Speed.Swim != 0 {
			speedString += fmt.Sprintf(", swim %dft.", creature.Speed.Swim)
		}
		md += fmt.Sprintf("| **Speed** | %s |\n", speedString)
	}

	if creature.SavingThrows != "" {
		md += fmt.Sprintf("| **Saving Throws** | %s |\n", creature.SavingThrows)
	}
	if creature.Skills != "" {
		md += fmt.Sprintf("| **Skills** | %s |\n", creature.Skills)
	}
	if creature.DamageVulnerabilities != "" {
		md += fmt.Sprintf("| **Damage Vulnerabilities** | %s |\n", creature.DamageVulnerabilities)
	}
	if creature.DamageResistances != "" {
		md += fmt.Sprintf("| **Damage Resistances** | %s |\n", creature.DamageResistances)
	}
	if creature.DamageImmunities != "" {
		md += fmt.Sprintf("| **Damage Immunities** | %s |\n", creature.DamageImmunities)
	}
	if creature.ConditionImmunities != "" {
		md += fmt.Sprintf("| **Condition Immunities** | %s |\n", creature.ConditionImmunities)
	}
	if creature.Senses != "" {
		md += fmt.Sprintf("| **Senses** | %s |\n", creature.Senses)
	}
	if creature.Languages != "" {
		md += fmt.Sprintf("| **Languages** | %s |\n", creature.Languages)
	}
	if creature.ChallengeRating != "" {
		md += fmt.Sprintf("| **Challenge** | %s |\n", creature.ChallengeRating)
	}
	if creature.ProficiencyBonus != 0 {
		md += fmt.Sprintf("| **Proficiency Bonus** | %d |\n", creature.ProficiencyBonus)
	}
	md += "---\n"

	md += "| STR | DEX | CON | INT | WIS | CHA |\n"
	md += "| :-: | :-: | :-: | :-: | :-: | :-: |\n"
	md += fmt.Sprintf("| %d (%s) | %d (%s) | %d (%s) | %d (%s) | %d (%s) | %d (%s) |\n",
		creature.AbilityScores.Strength, GetModifier(creature.AbilityScores.Strength),
		creature.AbilityScores.Dexterity, GetModifier(creature.AbilityScores.Dexterity),
		creature.AbilityScores.Constitution, GetModifier(creature.AbilityScores.Constitution),
		creature.AbilityScores.Intelligence, GetModifier(creature.AbilityScores.Intelligence),
		creature.AbilityScores.Wisdom, GetModifier(creature.AbilityScores.Wisdom),
		creature.AbilityScores.Charisma, GetModifier(creature.AbilityScores.Charisma))
	md += "---\n"

	if len(creature.Actions) > 0 {
		md += "\n**ACTIONS**\n---\n"
		for _, a := range creature.Actions {
			md += fmt.Sprintf("***%s.*** %s\n\n", a.Name, a.Description)
		}
	}
	if len(creature.BonusActions) > 0 {
		md += "\n**BONUS ACTIONS**\n---\n"
		for _, a := range creature.BonusActions {
			md += fmt.Sprintf("***%s.*** %s\n\n", a.Name, a.Description)
		}
	}
	if len(creature.Reactions) > 0 {
		md += "\n**REACTIONS**\n---\n"
		for _, a := range creature.Reactions {
			md += fmt.Sprintf("***%s.*** %s\n\n", a.Name, a.Description)
		}
	}
	if len(creature.LegendaryActions) > 0 {
		md += "\n**LEGENDARY ACTIONS**\n---\n"
		for _, a := range creature.LegendaryActions {
			md += fmt.Sprintf("***%s.*** %s\n\n", a.Name, a.Description)
		}
	}
	if len(creature.Options) > 0 {
		md += "\n**OPTIONS**\n---\n"
		for _, a := range creature.Options {
			md += fmt.Sprintf("***%s.*** %s\n\n", a.Name, a.Description)
		}
	}
	if creature.Description != "" {
		md += fmt.Sprintf("\n**DESCRIPTION**\n---\n%s\n", creature.Description)
	}
	if creature.Notes != "" {
		md += fmt.Sprintf("\n**NOTES**\n---\n%s\n", creature.Notes)
	}

	return strings.TrimSpace(md), nil
}

func GetModifier(score int) string {
	mod := math.Floor(float64(score-10) / 2)
	if mod >= 0 {
		return fmt.Sprintf("+%d", int(mod))
	}
	return fmt.Sprintf("%d", int(mod))
}
