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
