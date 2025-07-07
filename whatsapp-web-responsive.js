// ==UserScript==
// @name        WhatsApp Web Responsive
// @namespace   Violentmonkey Scripts
// @match       *://web.whatsapp.com/*
// @grant       none
// @version     1.2
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
/*#########################################################################################
#  ELEMENTS              CSS selectors                                                    #
#-----------------------------------------------------------------------------------------#
#  CONTAINER             #app>div>div>div:has(header) {min-width: fit-content;}           #
#    SIDEBAR             #app>div>div>div>header {                                        #
#    SPLASHSCREEN        #app>div>div>div>div:has(div>div>div>span[data-icon*="logo"])    #
#    LIST-OF-CHATS       #app>div>div>div>div:has(header>div>div>h1)                      #
#      CHAT              #app>div>div>div>div:has(div>header)                             #
#        CHAT-HEADER     #app>div>div>div>div>div>header                                  #
#        CHAT-CONTENT    #main>div>div>div>div                                            #
#          EMOJI-PANEL   #expressions-panel-container>span>div                            #
#        CHAT-FOOTER     #main>footer                                                     #
#        CHAT-INFO       #app>div>div>div>div:has(span>div>span>div>div>header)           #
#        CHAT-MEDIA-ROLL #app>div>div>div>div:has(span>div>span>div>header)               #
#        CHAT-MEDIA-SEND #app>div>div>div>div>div:has(span>div>div>div>div>div>input)     #
#    CHAT-TABLIST        #side>div[role="tablist"]                                        #
#########################################################################################*/

@media (max-width: 747px) {
/*𝐂𝐎𝐍𝐓𝐀𝐈𝐍𝐄𝐑*/
    #app>div>div>div:has(header) {
        display: flex! important;
        overflow: hidden! important;
        min-width: fit-content !important;
        max-width: 100vw;
    }
/*𝐒𝐏𝐋𝐀𝐒𝐇𝐒𝐂𝐑𝐄𝐄𝐍*/
    #app>div>div>div>div:has(div>div>div>span[data-icon*="logo"]) {max-width: 0%;}
/*𝐒𝐈𝐃𝐄𝐁𝐀𝐑*/
    #app>div>div>div>header, #app>div>div>div>header * {
        flex: 0 0 0 !important;
        width: 0 !important;
        max-width: 0 !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        overflow: hidden !important;
    }
/*𝐋𝐈𝐒𝐓-𝐎𝐅-𝐂𝐇𝐀𝐓𝐒*/
    #app>div>div>div>div:has(header>div>div>h1){
        flex: 1 1 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        overflow: hidden !important;
    }
/*𝐂𝐇𝐀𝐓-𝐇𝐄𝐀𝐃𝐄𝐑 + 𝐂𝐇𝐀𝐓-𝐂𝐎𝐍𝐓𝐄𝐍𝐓 + 𝐂𝐇𝐀𝐓-𝐅𝐎𝐎𝐓𝐄𝐑*/
    #app>div>div>div>div>div>header, #main>div>div>div>div, #main>footer {max-width: 100vw;}
/*𝐂𝐇𝐀𝐓*/
    #app>div>div>div>div:has(div>header){
        flex: 0 0 100% !important;
        max-width: 100% !important;
        min-width: 0% !important;
        overflow: hidden! important;
    }
/*𝐂𝐇𝐀𝐓-𝐈𝐍𝐅𝐎 + 𝐂𝐇𝐀𝐓-𝐌𝐄𝐃𝐈𝐀-𝐒𝐄𝐍𝐃 + 𝐂𝐇𝐀𝐓-𝐌𝐄𝐃𝐈𝐀-𝐑𝐎𝐋𝐋*/
    #app>div>div>div>div:has(span>div>span>div>div>header),
    #app>div>div>div>div>div:has(span>div>div>div>div>div>input),
    #app>div>div>div>div:has(span>div>span>div>header) {
        position: absolute;
        width: 99vw;
    }
/*𝐄𝐌𝐎𝐉𝐈-𝐏𝐀𝐍𝐄𝐋*/
    #expressions-panel-container>span>div {left: 0px !important; max-width: 100% !important;}
/*𝐄𝐒𝐂-𝐁𝐔𝐓𝐓𝐎𝐍 (via js injection)*/
    .esc-button {
        margin-left: -8px !important;
        padding-right: 16px !important;
    }
}

/*𝐎𝐏𝐓𝐈𝐎𝐍𝐀𝐋𝐒*/
/*𝐂𝐇𝐀𝐓-𝐓𝐀𝐁𝐋𝐈𝐒𝐓*/ #side>div[role="tablist"] {visibility:hidden;height:0px;padding:0px;}
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
      path.setAttribute('d', 'M 48 23 H 15 C 14 23 13 22 14 21 L 23 12 C 25 10 25 10 23 8 L 23 8 C 21 6 21 6 19 8 L 4 24 C 2 26 2 26 4 28 L 19 44 C 21 46 21 46 23 44 L 23 44 C 25 42 25 42 23 40 L 14 31 C 13 30 14 29 15 29 H 48 C 50 29 50 29 50 27 V 25 C 50 23 50 23 48 23 Z');

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
