// ==UserScript==
// @name         WhatsApp Web Responsive
// @match        *://web.whatsapp.com/*
// @grant        none
// @author       DavidBevi
// ==/UserScript==

(function () {
  'use strict';

  function injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
/*#########################################################################################
#  search with    document.querySelector('')                                              #
#  PARENT         #app>div>div>div                                                        #
#  TOOLBAR        #app>div>div>div>header {                                               #
#  CHATLIST       #app>div>div>div>div:has(header>div>div>h1)                             #
#  CONVO          #app>div>div>div>div:has(div>header)                                    #
#  SPLASH         #app>div>div>div>div:has(div>div>div>span[data-icon*="logo"])           #
#########################################################################################*/

@media (max-width: 747px) {
 /* 𝐏𝐀𝐑𝐄𝐍𝐓 */
    #app>div>div>div {display:flex!important; overflow:hidden!important;}
 /* 𝐒𝐏𝐋𝐀𝐒𝐇 - 𝐇𝐈𝐃𝐄 */
    #app>div>div>div>div:has(div>div>div>span[data-icon*="logo"]) {max-width: 0%;}
 /* 𝐓𝐎𝐎𝐋𝐁𝐀𝐑 - 𝐇𝐈𝐃𝐄 */
    #app>div>div>div>header {
        flex: 0 0 0 !important;
        width: 0 !important;
        max-width: 0 !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        overflow: hidden !important;
    }
 /* 𝐂𝐇𝐀𝐓𝐋𝐈𝐒𝐓 - 𝐅𝐈𝐋𝐋 (𝐠𝐢𝐯𝐞 𝐫𝐨𝐨𝐦 𝐭𝐨 𝐜𝐨𝐧𝐯𝐨) */
    #app>div>div>div>div:has(header>div>div>h1){
        flex: 1 1 100% !important;
        max-width: none !important;
        min-width: 0 !important;
    }
 /* 𝐂𝐎𝐍𝐕𝐎 - 𝐅𝐈𝐋𝐋 (𝐭𝐚𝐤𝐞 𝐩𝐫𝐢𝐨𝐫𝐢𝐭𝐲 𝐨𝐯𝐞𝐫 𝐜𝐡𝐚𝐭𝐥𝐢𝐬𝐭) */
    #app>div>div>div>div:has(div>header){
        flex: 0 0 100% !important;
        max-width: 100% !important;
        min-width: 0% !important;
    }
} /* ------------------------------------------------------------------------------------ */
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

  // Delay to ensure page is fully loaded
  setTimeout(() => {
    injectCSS();
    debugAndLogUnread();
    setInterval(debugAndLogUnread, 1000);
  }, 3000);
})();
