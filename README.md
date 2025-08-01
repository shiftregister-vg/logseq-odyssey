# Odyssey Logseq Plugin 🚀

Odyssey is a Logseq plugin designed to provide useful tools for Dungeon Masters and players in tabletop role-playing games. The core logic is written in Go and compiled to WebAssembly for performance, with the UI built in React and TypeScript.

## Features

- **Initiative Tracker:**
  - Right-click on any block to start tracking combat initiative.
  - Quickly add combatants with their name, initiative score, and current damage.
  - Edit existing combatants (name, initiative, damage).
  - Remove combatants from the list.
  - Track combat rounds with dedicated controls.
  - Automatically generates a Markdown table in the selected block, sorted by initiative (descending).
- **Creature Stat Block Editor:**
  - Create and edit D&D 5e-style creature stat blocks.
  - Automatically parses and generates markdown for easy storage and sharing.
  - Supports all standard creature fields, including actions, bonus actions, reactions, and legendary actions.
  - Provides a user-friendly form for editing all creature attributes.
- Develop with HMR, empowered by lightning-fast Vite ⚡
- TailwindCSS for styling (though custom styling is currently applied directly).
- Pnpm for package management.

## How to get started
1. Clone the repository: `git clone https://github.com/shiftregister-vg/logseq-odyssey.git` (or your fork) 🔨
2. Make sure you have pnpm installed, [install](https://pnpm.io/installation) if necessary 🛠
3. Navigate into the cloned directory: `cd logseq-odyssey`
4. Execute `pnpm install` to install dependencies 📦
5. Execute `pnpm build` to build the plugin 🚧
6. Enable developer-mode in Logseq, go to plugins, select "Load unpacked plugin" 🔌
7. Select the directory of your plugin (not the `/dist`-directory, but the directory which includes your package.json) 📂
8. Enjoy! 🎉