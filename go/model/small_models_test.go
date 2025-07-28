package model

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestInitiativeTrackerFromMarkdown(t *testing.T) {
	tests := []struct {
		name        string
		markdown    string
		expected    InitiativeTracker
		expectError bool
	}{
		{
			name: "Full initiative tracker",
			markdown: `
Round: 3
| Name | Initiative | Damage |
|---|---|---|
| Player 1 | 20 | 10 |
| Player 2 | 15 | 5 |
| Monster 1 | 10 | 0 |
`,
			expected: InitiativeTracker{
				Round: 3,
				Combatants: []Combatant{
					{Name: "Player 1", Initiative: 20, Damage: 10},
					{Name: "Player 2", Initiative: 15, Damage: 5},
					{Name: "Monster 1", Initiative: 10, Damage: 0},
				},
			},
		},
		{
			name: "Empty initiative tracker",
			markdown: `
Round: 1
| Name | Initiative | Damage |
|---|---|---|
`,
			expected: InitiativeTracker{
				Round:      1,
				Combatants: []Combatant{},
			},
		},
		{
			name:     "No round number",
			markdown: "| Name | Initiative | Damage |\n|---|---|---|\n| Player 1 | 20 | 10 |",
			expected: InitiativeTracker{
				Round: 1,
				Combatants: []Combatant{
					{Name: "Player 1", Initiative: 20, Damage: 10},
				},
			},
		},
		{
			name:     "Malformed table",
			markdown: "Round: 1\n| Name | Initiative |\n|---|---|",
			expected: InitiativeTracker{
				Round:      1,
				Combatants: []Combatant{},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var it InitiativeTracker
			err := it.FromMarkdown(tt.markdown)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, it)
			}
		})
	}
}
