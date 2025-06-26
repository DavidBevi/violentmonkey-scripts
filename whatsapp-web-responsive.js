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
#  GRANPA         #app>div>div:has(div>header) {width: 100vw;}                            #
#  DAD            #app>div>div>div:has(header) {min-width: fit-content;}                  #
#  SIDEBAR        #app>div>div>div>header {                                               #
#  CHATLIST       #app>div>div>div>div:has(header>div>div>h1)                             #
#  CHAT           #app>div>div>div>div:has(div>header)                                    #
#  SPLASHSCREEN   #app>div>div>div>div:has(div>div>div>span[data-icon*="logo"])           #
#########################################################################################*/

@media (max-width: 747px) {
 /* GRANPA - cap width */
    #app>div>div:has(div>header) {width: 100vw;}
 /* DAD - cap width */
    #app>div>div>div:has(header) {
        display: flex! important;
        overflow: hidden! important;
        min-width: fit-content !important;
    }
 /* SPLASHSCREEN - hide */
    #app>div>div>div>div:has(div>div>div>span[data-icon*="logo"]) {max-width: 0%;}
 /* SIDEBAR - hide */
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
 /* CHATLIST - fill space (when avaliable) */
    #app>div>div>div>div:has(header>div>div>h1){
        flex: 1 1 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        overflow: hidden !important;
    }
 /* CHAT - fill space (priority over chatlist) */
    #app>div>div>div>div:has(div>header){
        flex: 0 0 100% !important;
        max-width: 100% !important;
        min-width: 0% !important;
        overflow: hidden! important;
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
