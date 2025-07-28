package main

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/shiftregister-vg/logseq-odyssey/go/model"
)

func parseInitiativeTable(content string) (map[string]interface{}, error) {
	lines := strings.Split(content, "\n")
	combatants := []model.Combatant{}
	round := 1

	if len(lines) > 0 {
		re := regexp.MustCompile(`Round: (\d+)`)
		matches := re.FindStringSubmatch(lines[0])
		if len(matches) > 1 {
			round, _ = strconv.Atoi(matches[1])
		}
	}

	startIndex := -1
	for i, line := range lines {
		if strings.Contains(line, "| Name | Initiative | Damage |") && i+1 < len(lines) && strings.Contains(lines[i+1], "|---|---|---") {
			startIndex = i + 2
			break
		}
	}

	if startIndex == -1 {
		return map[string]interface{}{
			"combatants": combatants,
			"round":      round,
		}, nil
	}

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
					combatants = append(combatants, model.Combatant{Name: name, Initiative: initiative, Damage: damage})
				}
			}
		} else {
			break
		}
	}

	return map[string]interface{}{
		"combatants": combatants,
		"round":      round,
	}, nil
}



