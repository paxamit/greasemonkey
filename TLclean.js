// ==UserScript==
// @name        TLclean
// @author      Paxamit
// @description Hides date and category until row is hovered
// @namespace   paxamit
// @include     http://torrentleech.org/*
// @include     http://www.torrentleech.org/*
// @license     MIT
// @version     0.2
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle("#torrents tr:not(:hover) td.name { color: transparent }")
