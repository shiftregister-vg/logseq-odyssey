package model

import (
	"strconv"
	"strings"
)

type InitiativeTracker struct {
	Combatants []Combatant `json:"combatants"`
	Round      int         `json:"round"`
}

type Combatant struct {
	Name       string `json:"name"`
	Initiative int    `json:"initiative"`
	Damage     int    `json:"damage"`
}

type Action struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (it *InitiativeTracker) FromMarkdown(content string) error {
	it.Round = 1
	it.Combatants = []Combatant{}

	lines := strings.Split(content, "\n")

	if len(lines) > 0 {
		for _, line := range lines {
			if strings.HasPrefix(line, "Round: ") {
				round, err := strconv.Atoi(strings.TrimPrefix(line, "Round: "))
				if err == nil {
					it.Round = round
				}
			}
		}
	}

	startIndex := -1

	for i, line := range lines {
		if strings.Contains(line, "| Name | Initiative | Damage |") && i+1 < len(lines) && strings.Contains(lines[i+1], "|---|---|---") {
			startIndex = i + 2
			break
		}
	}

	if startIndex != -1 {
		for i := startIndex; i < len(lines); i++ {
			line := strings.TrimSpace(lines[i])
			if strings.HasPrefix(line, "|") && strings.HasSuffix(line, "|") {
				parts := strings.Split(line, "|")
				var filteredParts []string
				for _, part := range parts {
					if strings.TrimSpace(part) != "" {
						filteredParts = append(filteredParts, strings.TrimSpace(part))
					}
				}

				if len(filteredParts) >= 3 {
					name := filteredParts[0]
					initiative, err1 := strconv.Atoi(filteredParts[1])
					damage, err2 := strconv.Atoi(filteredParts[2])

					if err1 == nil && err2 == nil {
						it.Combatants = append(it.Combatants, Combatant{Name: name, Initiative: initiative, Damage: damage})
					}
				}
			} else {
				break
			}
		}
	}

	return nil
}
