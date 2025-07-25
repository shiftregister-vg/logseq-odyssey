
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

const apiBaseURL = "https://5e-bits.github.io/data"

type SRDAction struct {
	Name        string `json:"name"`
	Desc        string `json:"desc"`
	AttackBonus int    `json:"attack_bonus,omitempty"`
	DamageDice  string `json:"damage_dice,omitempty"`
	DamageBonus int    `json:"damage_bonus,omitempty"`
}

type SRDMonster struct {
	ID                   string      `json:"id"`
	Name                 string      `json:"name"`
	Size                 string      `json:"size"`
	Type                 string      `json:"type"`
	Subtype              string      `json:"subtype"`
	Alignment            string      `json:"alignment"`
	ArmorClass           int         `json:"armor_class"`
	HitPoints            int         `json:"hit_points"`
	HitDice              string      `json:"hit_dice"`
	Speed                string      `json:"speed"`
	Strength             int         `json:"strength"`
	Dexterity            int         `json:"dexterity"`
	Constitution         int         `json:"constitution"`
	Intelligence         int         `json:"intelligence"`
	Wisdom               int         `json:"wisdom"`
	Charisma             int         `json:"charisma"`
	Proficiencies        map[string]int `json:"proficiencies"`
	DamageVulnerabilities string      `json:"damage_vulnerabilities"`
	DamageResistances    string      `json:"damage_resistances"`
	DamageImmunities     string      `json:"damage_immunities"`
	ConditionImmunities  string      `json:"condition_immunities"`
	Senses               string      `json:"senses"`
	Languages            string      `json:"languages"`
	ChallengeRating      float64     `json:"challenge_rating"`
	SpecialAbilities     []SRDAction `json:"special_abilities"`
	Actions              []SRDAction `json:"actions"`
	LegendaryActions     []SRDAction `json:"legendary_actions"`
}

func fetchSRD[T any](endpoint string) ([]T, error) {
	resp, err := http.Get(fmt.Sprintf("%s/%s.json", apiBaseURL, endpoint))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data []T
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, err
	}

	return data, nil
}

func findMonster(name string) (*SRDMonster, error) {
	monsters, err := fetchSRD[SRDMonster]("monsters")
	if err != nil {
		return nil, err
	}

	for _, m := range monsters {
		if strings.EqualFold(m.Name, name) {
			return &m, nil
		}
	}

	return nil, nil
}
