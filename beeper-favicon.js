// ==UserScript==
// @name         Beeper Favicon Force Replacement
// @match        *://chat.beeper.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

 // single hollow path: M6 0h3q6 0 6 5v3q0 5-5.6 5-2.2 0-3.2 1l-1 1c-1 1-2 .4-1.7-1l.2-1.1q-3.7-.5-3.7-4.9v-3q0-5 6-5M6.2 1.5q-4.5 0-4.5 3.6v2.7q0 3.15 2.7 3.51 1.17.09.54 1.71 0 .27.18.09 1.08-1.71 3.78-1.71 4.5 0 4.5-3.6v-2.7q0-3.6-4.5-3.6z
  function makeFavicon(count) {
    const badgeText = count ? `<text x="7.5" y="10" font-size="9" text-anchor="middle" fill="white" font-family="arial" font-weight="bold" stroke="#000" stroke-width="2.5" paint-order="stroke">${count}</text>` : '';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path fill="white" d="M6 0h3q6 0 6 5v3q0 5-5.6 5-2.2 0-3.2 1l-1 1c-1 1-2 .4-1.7-1l.2-1.1q-3.7-.5-3.7-4.9v-3q0-5 6-5z" />
        <path fill="black" d="M6.2 1.5q-4.5 0-4.5 3.6v2.7q0 3.15 2.7 3.51 1.17.09.54 1.71 0 .27.18.09 1.08-1.71 3.78-1.71 4.5 0 4.5-3.6v-2.7q0-3.6-4.5-3.6z" />
        ${badgeText}
      </svg>`;
    return "data:image/svg+xml;base64," + btoa(svg);
  }

  function getUnreadCountFromTitle() {
    const match = document.title.match(/\[(\d+)\]/);
    return match ? match[1] : null;
  }

  function forceFavicon() {
    const count = getUnreadCountFromTitle();

    // Find all favicon links and update them
    const links = document.querySelectorAll("link[rel~='icon']");
    if (links.length === 0) {
      // If none, create one
      const link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
      links.push(link);
    }

    for (const link of links) {
      try {
        // Override href setter to block future changes to favicon on this link
        const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href');
        if (!link._overrideSet) {
          Object.defineProperty(link, 'href', {
            set(value) {
              // Ignore any attempt to change href different from ours
              if (value !== this.getAttribute('href')) {
                // Block overwriting by Beeper, do nothing
                // console.log('Blocked Beeper favicon update:', value);
              }
            },
            get() {
              return this.getAttribute('href');
            },
            configurable: true,
            enumerable: true,
          });
          link._overrideSet = true;
        }

        // Force set our favicon href
        const newHref = makeFavicon(count);
        if (link.href !== newHref) {
          link.setAttribute('href', newHref);
        }
      } catch (e) {
        // ignore errors
      }
    }
  }

  // Run forceFavicon every 200ms to override Beeper attempts
  setInterval(forceFavicon, 200);

  // Also run once immediately
  forceFavicon();

})();
