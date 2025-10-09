// ==UserScript==
// @name        WhatsApp Web Responsive
// @namespace   Violentmonkey Scripts
// @match       *://web.whatsapp.com/*
// @grant       none
// @version     1.5 (2025-10-07 layout change)
// @author      DavidBevi
// @description Improves WA web on narrow windows, displaying
//              either chat-list or a conversation, one at a time.
//              Back button injected in chat view to go back
//              to the chat-list (or press ESC).
// ==/UserScript==

(function () {
  'use strict';

  function injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
@media (max-width: 750px) { /* ⬇️⬇️⬇️ BEGIN WRAPPING ⬇️⬇️⬇️ */

/* ℹ️ SIDEBAR ✅ Hide to make space */
#app>div>div>div>div>header {
    flex: 0 0 0;
    max-width: 0;
    min-width: 0;
    padding: 0;
    margin: 0;
    border: 0;
    overflow: hidden;
}

/* ℹ️ CHAT-LIST'S-TABs ✅ Hide to make space */
div[role="tablist"] {
    visibility: hidden;
    height: 0px;
    padding: 0px;
}

/* ℹ️ NO-CHAT-SELECTED (+children) ✅ Hide to make space */
#app>div>div>div>div>div:has(div>div>div>span[data-icon*="start"]),
#app>div>div>div>div>div:has(div>div>div>span[data-icon*="start"]) * {
    width: 0;
    visibility: hidden;
}

/* ℹ️ EMOJI-PANEL ✅ Fill (prevent overflow) */
#expressions-panel-container>span>div {
    left: 0px !important;
    max-width: 100vw;
}

/* ℹ️ EMOJI-LIST ✅ Allow horizontal scroll */
#expressions-panel-container>span>div>ul>div>div>div>div>div>div>div {
    overflow-x: auto;
}

/* ℹ️ PANELS ✅ Set properties */
#app>div>div>div>div>div>div:has(>div:only-child>span:only-child) {
    margin: 0;
    border: 0;
    flex: 0;
}

/* ℹ️ LEFT-PANEL when CHAT is CLOSED ✅ Expand */
#app:not(:has(#main))>div>div>div>div>div>div:has(>div:only-child>span:only-child):first-child {
    flex: 1;
    min-width: 100vw;
}

/* ℹ️ RIGHT-PANEL when CHAT is OPEN  ✅ Expand */
#app:has(#main)>div>div>div>div>div>div:has(>div:only-child>span:only-child):nth-child(2) {
    flex: 1;
    width: 100vw;
}

/* ℹ️ MAIN-HEADER when CHAT is OPEN ✅ Hide */
#app:has(#main)>div>div>div>div>div>header>header {
    visibility: hidden;
}

/* ℹ️ INFO-PANEL ✅ Fix width (bigger but capped) */
#app>div>div>div>div>div:has(span>div>span>div>div) {
    width: 350pt;
    max-width: 100vw;
}


/* ℹ️ CHAT-GRANDPARENT ✅ Prevent extra space with 'fit-content' */
#app>div>div>div>div:has(div>#side) {
    min-width: fit-content;
    max-width: 100vw;
}

/* ℹ️ CHAT-PARENT ✅ Hide unwanted spacer */
#app>div>div>div>div>div:has(#side) {
    min-width: 0;
    max-width: 0;
}

/* ℹ️ CHAT-LIST (2 els) when CHAT-OPEN doesn't exist ✅ Fill space */
#app:not(:has(#main))>div>div>div>div>div>header,
#app:not(:has(#main))>div>div>div>div>div>#side {
    width: 100vw;
    visibility: visible;
}

/* ℹ️ CHAT-OPEN ✅ Already fills space, don't change */
#app>div>div>div>div>div>#main {
}

/* ℹ️ USE-HERE ✅ Fix pos and width */
#app>div>div>div:nth-child(2)>div>div>div {
    position: absolute !important;
    left: 0px !important;
    max-width: 100vw;
}

/* ℹ️ SEND-FILE-PANEL (multiple elements) ✅ Fix padding */
#app>div>div>div>div>div>div>div>span>div>div>div>div>div>div>div>div {
    padding: 0;
    margin: 0;
}
/* ℹ️ SEND-IMAGE-TOOLBAR ✅ Make scrollable */
#app>div>div>div>div>div>div>div>span>div>div>div>div>div>div>div {
    overflow-x: scroll;
    scrollbar-width: none;
}

} /* ⬆️⬆️⬆️ END WRAPPING ⬆️⬆️⬆️ */
`;
    document.head.appendChild(style);
  }

  function injectEscButton() {
    if (window.innerWidth >= 750) return;

    const target = document.querySelector('#main>header:has(div>div>img)');
    if (target && !target.querySelector('.esc-button')) {
      const btn = document.createElement('button');
      btn.className = 'esc-button';

      // Copy style classes from native button if available
      const nativeBtn = document.querySelector('button[aria-label="Menu"], button[aria-label*="Cerca"]');
      if (nativeBtn) {
        btn.className = nativeBtn.className + ' esc-button';
      }

      // SVG icon
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 56 56');
      svg.setAttribute('height', '24');
      svg.setAttribute('width', '24');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M45 23h-33q-3 0-1-2l9-9q2-2 0-4l0 0q-2-2-4 0l-15 16q-2 2 0 4l15 16q2 2 4 0l0 0q2-2 0-4l-9-9q-2-2 1-2h33q2 0 2-2v-2q0-2-2-2z');

      svg.appendChild(path);
      btn.appendChild(svg);

      btn.onclick = () => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Escape',
          keyCode: 27,
          which: 27,
          bubbles: true
        }));
      };

      target.insertBefore(btn, target.firstChild);
    }
  }

  setTimeout(() => {
    injectCSS();
    setInterval(injectEscButton, 500);
  }, 3000);
})();
