import { createRoot } from "react-dom/client";
import { doc, globals } from "../globals/globals"

const model = {
  openOdysseyMenu() {
    const key = 'odyssey-menu-ui';
    const toolbarIcon = doc.getElementById("odyssey-menu-button");
    if (toolbarIcon) {
      const { left, top, height } = toolbarIcon.getBoundingClientRect();
      logseq.provideUI({
        key,
        template: `<div id="${key}"></div>`,
        style: {
          left: `${left}px`,
          top: `${top + height}px`,
          width: '200px',
        },
        attrs: {
          title: 'Odyssey Menu',
        }
      });
      const rootEl = doc.getElementById(key);
      if (rootEl) {
        const reactRoot = createRoot(rootEl);
        reactRoot.render(
          <div style={{ padding: '1rem' }}>
            <ul>
              <li><a href="#">SRD Lookup</a></li>
              <li><a href="#">Dice Roller</a></li>
            </ul>
          </div>
        );
      }
    }
  },
};

export const toolbar = () => {
  logseq.provideModel(model)
  return {
    key: 'odyssey',
    template: `<a id="odyssey-menu-button" data-on-click="openOdysseyMenu" class="button">${globals.menuIcon}</a>`,
  }
}
