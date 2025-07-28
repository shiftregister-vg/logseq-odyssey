package model

type Combatant struct {
	Name       string `json:"name"`
	Initiative int    `json:"initiative"`
	Damage     int    `json:"damage"`
}

type Action struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}
