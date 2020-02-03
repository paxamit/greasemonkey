// ==UserScript==
// @name        TLclean
// @author      Paxamit
// @description Hides date and category until row is hovered
// @namespace   paxamit
// @include     http://*.torrentleech.org/*
// @include     https://*.torrentleech.org/*
// @exclude     http://*classic.torrentleech.org/*
// @exclude     https://*classic.torrentleech.org/*
// @license     MIT
// @version     0.23
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle(`
.torrents tr:not(:hover) div.info { color: transparent !important; }
.torrents tr:not(:hover) div.info a { color: transparent !important; }
.torrents tr:not(:hover) div.info .fa-star { color: transparent !important; }
`)
