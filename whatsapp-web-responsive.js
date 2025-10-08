// ==UserScript==
// @name        WhatsApp Web Responsive
// @namespace   Violentmonkey Scripts
// @match       *://web.whatsapp.com/*
// @grant       none
// @version     1.4 (2025-10-07 layout change)
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
    left: 0px;
    max-width: 100%;
}

/* ℹ️ UNWANTED-BORDER ✅ Hide (applies to Div and his brother) */
#app>div>div>div>div>div>div:has(>div:only-child>span:only-child) {
    border: none;
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
t
/* ℹ️ CHAT-LIST (2 els) when CHAT-OPEN doesn't exist ✅ Fill space */
#app:not(:has(#main))>div>div>div>div>div>header,
#app:not(:has(#main))>div>div>div>div>div>#side {
    width: 100vw;
}

/* ℹ️ CHAT-LIST (2 els) when CHAT-OPEN exists ✅ Hide (to show chat) */
#app:has(#main)>div>div>div>div>div>header,
#app:has(#main)>div>div>div>div>div>#side {
    width: 0;
}

/* ℹ️ CHAT-OPEN ✅ Already fills space, don't change */
#app>div>div>div>div>div>#main {
}

/* ℹ️ INFO-PANEL ✅ Fix width (bigger but capped) */
#app>div>div>div>div>div:has(span>div>span>div>div) {
    width: 350pt;
    max-width: 85vw;
}

} /* ⬆️⬆️⬆️ END WRAPPING ⬆️⬆️⬆️ */
`;
    document.head.appendChild(style);
  }

  function debugAndLogUnread() {
    const spans = Array.from(document.querySelectorAll('span'));
    const unreadBadges = spans.filter(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const name = el.getAttribute('aria-label') || el.getAttribute('name') || '';
      return (bg === 'rgb(0, 168, 132)' || bg === 'rgb(37, 211, 102)') &&
             (name.trim().toLowerCase() === 'da leggere' || name.toLowerCase().includes('non lett') ||
              name.toLowerCase() === 'unread' || name.toLowerCase().includes('unread'));
    });
    console.log('[Unread Debug]', unreadBadges.length, unreadBadges);
  }

  function injectEscButton() {
    if (window.innerWidth >= 748) return;

    const target = document.querySelector('#app>div>div>div>div>div>header');
    if (target && !target.querySelector('.esc-button')) {
      const btn = document.createElement('button');
      btn.className = 'esc-button';

      const nativeBtn = document.querySelector('button[aria-label="Menu"], button[aria-label="Cerca…"]');
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
      path.setAttribute('d', 'M48 23H15Q12 23 14 21L23 12Q25 10 23 8L23 8Q21 6 19 8L4 24Q2 26 4 28L19 44Q21 46 23 44L23 44Q25 42 23 40L14 31Q12 29 15 29H48Q50 29 50 27V25Q50 23 48 23Z');

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
    debugAndLogUnread();
    setInterval(debugAndLogUnread, 1000);
    setInterval(injectEscButton, 1000);
  }, 3000);
})();
