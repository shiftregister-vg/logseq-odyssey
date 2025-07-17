import { globals } from "../globals/globals"

// const model = {
//   openOdysseyMenu() {
//     const key = 'odyssey-menu-ui';
//     const toolbarIcon = parent.document.getElementById("odyssey-menu-button");
//     if (toolbarIcon) {
//       const { left, top, height } = toolbarIcon.getBoundingClientRect();
//       logseq.provideUI({
//         key,
//         template: `<div id="${key}"></div>`,
//         style: {
//           left: `${left}px`,
//           top: `${top + height}px`,
//           width: '200px',
//         },
//         attrs: {
//           title: 'Odyssey Menu',
//         }
//       });
//       const rootEl = parent.document.getElementById(key);
//       if (rootEl) {
//         const reactRoot = createRoot(rootEl);
//         reactRoot.render(
//           <div style={{ padding: '1rem' }}>
//             <ul>
//               <li><a href="#">SRD Lookup</a></li>
//               <li><a href="#">Dice Roller</a></li>
//             </ul>
//           </div>
//         );
//       }
//     }
//   },
// };

export const toolbar = () => {
  return {
    key: 'odyssey',
    template: `<a id="odyssey-menu-button" data-on-click="openOdysseyMenu" class="button">${globals.menuIcon}</a>`,
  }
}
