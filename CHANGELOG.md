# CHANGELOG

## 0.1.0 - Odyssey Initiative Tracker

### Features

- **Initial Release of Odyssey Plugin:** Transformed from `logseq-plugin-template-react` into a dedicated D&D utility plugin.
- **Initiative Tracker:**
  - Right-click block context menu item to open the tracker.
  - Add combatants with Name, Initiative, and Damage.
  - Edit existing combatants.
  - Remove combatants.
  - Track combat rounds (Previous/Next Round controls).
  - Generates a Markdown table in the block, sorted by initiative (descending).
  - Basic UI styling for improved usability.

### Chores

- Updated plugin name and title to "Odyssey".
- Migrated project to a clean `logseq-plugin-template-react` base for Vite 7 compatibility.
- Cleaned up redundant configuration files and added build artifacts to `.gitignore`.