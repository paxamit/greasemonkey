// ==UserScript==
// @name        TLclean
// @author      Paxamit
// @description Hides date and category until row is hovered
// @namespace   paxamit
// @include     http://*.torrentleech.org/*
// @include     https://*.torrentleech.org/*
// @license     MIT
// @version     0.22
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle("#torrents tr:not(:hover) td.name { color: transparent }")
