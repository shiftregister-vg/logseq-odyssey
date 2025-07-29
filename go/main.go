//go:build js && wasm

package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/shiftregister-vg/logseq-odyssey/go/model"
)

func greet(this js.Value, args []js.Value) interface{} {
	name := "World"
	if len(args) > 0 {
		name = args[0].String()
	}
	return "Hello, " + name + "!"
}

func findMonsterJS(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return nil
	}
	name := args[0].String()
	monster, err := findMonster(name)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}

	jsonMonster, err := json.Marshal(monster)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}

	return string(jsonMonster)
}

func getModifierJS(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return nil
	}
	score := args[0].Int()
	return model.GetModifier(score)
}

func parseInitiativeTableJS(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return nil
	}
	content := args[0].String()
	var it model.InitiativeTracker
	err := it.FromMarkdown(content)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}

	jsonData, err := json.Marshal(it)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}

	return string(jsonData)
}

func parseCreatureStatBlockJS(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return nil
	}
	content := args[0].String()
	var creature model.Creature
	err := creature.FromMarkdown(content)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}

	jsonCreature, err := json.Marshal(creature)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}

	return string(jsonCreature)
}

func stringifyCreatureToMarkdownJS(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return nil
	}
	creatureJSON := args[0].String()
	var creature model.Creature
	err := json.Unmarshal([]byte(creatureJSON), &creature)
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}
	md, err := creature.ToMarkdown()
	if err != nil {
		js.Global().Get("console").Call("error", err.Error())
		return nil
	}
	return md
}

func main() {
	c := make(chan struct{}, 0)
	println("Go WebAssembly Initialized")

	js.Global().Set("odysseyWasm", js.ValueOf(map[string]interface{}{
		"greet":                       js.FuncOf(greet),
		"findMonster":                 js.FuncOf(findMonsterJS),
		"getModifier":                 js.FuncOf(getModifierJS),
		"parseInitiativeTable":        js.FuncOf(parseInitiativeTableJS),
		"parseCreatureStatBlock":      js.FuncOf(parseCreatureStatBlockJS),
		"stringifyCreatureToMarkdown": js.FuncOf(stringifyCreatureToMarkdownJS),
	}))

	<-c
}
