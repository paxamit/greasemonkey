// ==UserScript==
// @name        TLclean_classic
// @author      Paxamit
// @description Hides date and category until row is hovered
// @namespace   paxamit
// @include     http://*classic.torrentleech.org/*
// @include     https://*classic.torrentleech.org/*
// @license     MIT
// @version     0.22
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle("#torrents tr:not(:hover) td.name { color: transparent }")
