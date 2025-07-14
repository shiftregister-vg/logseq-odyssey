# [1.1.0](https://github.com/shiftregister-vg/logseq-odyssey/compare/v1.0.0...v1.1.0) (2025-07-14)


### Bug Fixes

* **creature-stat-block:** refactor markdown output to use tables ([4fad2ed](https://github.com/shiftregister-vg/logseq-odyssey/commit/4fad2ed63c3a30b4acddb4aac2aed564728e6626))
* embed creature stat block CSS directly in main.tsx ([34fabea](https://github.com/shiftregister-vg/logseq-odyssey/commit/34fabea222b10820aa2f3ea7dde98e93c68e8001))
* embed initiative tracker CSS directly in main.tsx ([f8f92c6](https://github.com/shiftregister-vg/logseq-odyssey/commit/f8f92c608f162a24f048c93e1028f1cd4a3d645d))
* improve hover checkbox styling and layout ([2df793b](https://github.com/shiftregister-vg/logseq-odyssey/commit/2df793bb92c08d0e0cbb5a94e484ee4c1cdc66c5))
* re-implement creature stat block UI with correct modal styling ([e2ff94c](https://github.com/shiftregister-vg/logseq-odyssey/commit/e2ff94cc2be45596ce3ddf689f92ca03905031bf))
* re-implement creature stat block UI with correct modal styling ([f39c709](https://github.com/shiftregister-vg/logseq-odyssey/commit/f39c7096bdb39493c8054ed637e988f60f652d12))


### Features

* add creature stat block feature ([2faa56d](https://github.com/shiftregister-vg/logseq-odyssey/commit/2faa56d5626c090b581ad14254e0dd9bf80e23f7))
* add labels to creature stat block fields ([9e325ce](https://github.com/shiftregister-vg/logseq-odyssey/commit/9e325ce73abf08e4c95e55ea6ab29c90fca93c90))
* add remaining labels to creature stat block fields ([4de7e89](https://github.com/shiftregister-vg/logseq-odyssey/commit/4de7e89794800cc5fd99032e54c8fa109ebd29d5))
* combine alignment fields into a single field ([c3c96c8](https://github.com/shiftregister-vg/logseq-odyssey/commit/c3c96c8cccb8846c0a818c4b9f4d1f5cb1fc7970))
* improve creature stat block rendering and parsing ([9c71bf7](https://github.com/shiftregister-vg/logseq-odyssey/commit/9c71bf7bf2100c13509d71ccff8fe55e11ea676a))
* set default alignment to Neutral ([d0bf308](https://github.com/shiftregister-vg/logseq-odyssey/commit/d0bf3089bb5a51d5a5fb70adea79c975e58d885b))

# 1.0.0 (2025-07-12)


### Bug Fixes

* add permissions to release action ([9b31c3a](https://github.com/shiftregister-vg/logseq-odyssey/commit/9b31c3a223f0447cb7b13e8624a9bb2cfec6325c))
* Ensure Enter key adds combatant ([ec45283](https://github.com/shiftregister-vg/logseq-odyssey/commit/ec45283e687d743c15871476ab6d17e79483d2b2))
* install pnpm in release action ([c0683d1](https://github.com/shiftregister-vg/logseq-odyssey/commit/c0683d1e7a5b5e1f85e1889e9ea794d2455da53e))
* update release config to use main branch ([2598926](https://github.com/shiftregister-vg/logseq-odyssey/commit/2598926b5ee4c97d5977a85d88570be8ef1fb251))


### Features

* Add combatant editing and removal ([1a42890](https://github.com/shiftregister-vg/logseq-odyssey/commit/1a4289065cc0c3d3997338c3c11bfc4d8dfb8405))
* Add damage and round tracking ([71d3360](https://github.com/shiftregister-vg/logseq-odyssey/commit/71d336066b98534b5f5f4401463999b7c0715cce))
* Add plugin load notification ([924e9eb](https://github.com/shiftregister-vg/logseq-odyssey/commit/924e9eb2f98e1ae5d4ec970c22e5500fa3e4f518))
* add release action ([8054ebc](https://github.com/shiftregister-vg/logseq-odyssey/commit/8054ebcd369bf1cf64634d5801ce5f13aec30a9a))
* Implement initiative tracker UI ([6de6c52](https://github.com/shiftregister-vg/logseq-odyssey/commit/6de6c5241a3f468b0aa6859238d05d6382e9f841))
* Integrate local vite-plugin-logseq and update to Vite 7 ([7ca1f43](https://github.com/shiftregister-vg/logseq-odyssey/commit/7ca1f43cbd350c7c1fc2cc33dc17a4173f8661ad))
* Replace project with official template ([c05c094](https://github.com/shiftregister-vg/logseq-odyssey/commit/c05c094e4304525f12f5285c8925d5c4ccb94873))
* Update initiative tracker styling based on user feedback. ([0234b30](https://github.com/shiftregister-vg/logseq-odyssey/commit/0234b3049681cb709a05d6ba744f910c5ae3e81a))
* Update plugin name and title to "Odyssey" ([d29437a](https://github.com/shiftregister-vg/logseq-odyssey/commit/d29437ae0ad177327cf2daf0acbfffd8a6ff35c6))

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
