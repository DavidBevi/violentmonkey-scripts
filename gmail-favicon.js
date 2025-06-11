// ==UserScript==
// @name         Gmail Favicon Replacement Persistent with Badge
// @match        *://mail.google.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // single hollow path: M4 .5h8c4 0 4 0 3.9 4v3.5c.1 4 .1 4-3.9 4h-8c-4 0-4 0-4-4v-3.5c0-4 0-4 4-4M13 2l-5 3.6-5-3.6zM2 3l5.5 4q.5.4 1 0l5.5-4.1q.5-.4.5.5v6.1q0 1-1 1h-11q-1 0-1-1v-6q0-.9.5-.5z
  // <circle cx="10" cy="6" r="6" fill="red" />

  let lastKnownCount = null; // Cache for the last known unread count

  function makeFavicon(count) {
    const badge = count ? `
      <text x="8" y="14.5" font-size="9" text-anchor="middle" fill="white" font-family="arial" font-weight="bold" stroke="black" stroke-width="2.8" paint-order="stroke">${count}</text>
    ` : '';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path fill="white" d="M5 .5h6c5 0 5 0 5 5.5v2c0 4 0 4-5 4h-6c-5 0-5 0-5-4v-2c0-5.5 0-5.5 5-5.5z" />
        <path fill="black" d="M12 2.1c1.2 0 1.2 0 0 .9l-4 3.1-4-3.1c-1.2-.9-1.2-.9 0-.9zM2 3.6l5.5 4.1q.5.4 1 0l5.5-4.1q.3-.2.3 1.4v4q0 1.3-1.3 1.3h-10q-1.3 0-1.3-1.3v-4q0-1.6.3-1.4z" />
        ${badge}
      </svg>`;
    return "data:image/svg+xml;base64," + btoa(svg);
  }

  function getUnreadCountFromTitle() {
    const match = document.title.match(/\((\d+)\)/);
    if (match) {
      lastKnownCount = match[1]; // Update cache
      return lastKnownCount;
    }
    return lastKnownCount; // Use cached value if no match
  }

  function setFavicon() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const count = getUnreadCountFromTitle();
    link.href = makeFavicon(count);
  }
  setFavicon();

  // Observer for favicon or title changes
  const observer = new MutationObserver(() => { setFavicon(); });
  observer.observe(document.querySelector("title"), { childList: true });
  observer.observe(document.head, { childList: true, subtree: true });

})();
