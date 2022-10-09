// ==UserScript==
// @name           TLpersonal
// @author         paxamit
// @description    change TL site look
// @namespace      paxamit
// @match          http://*.torrentleech.org/torrents/browse/*
// @match          https://*.torrentleech.org/torrents/browse/*
// @exclude        http://*classic.torrentleech.org/*
// @exclude        https://*classic.torrentleech.org/*
// @grant          GM_addStyle
// @version        0.1
// @license        MIT
// @require        https://gist.github.com/raw/2625891/waitForKeyElements.js
// @run-at         document-end
// ==/UserScript==


waitForKeyElements(".table-responsive", prettyPlease);

function prettyPlease(jNode) 
{
    var stats = $('ul.navbar-stats');
    $('ul.navbar-stats li:nth-child(8)').remove();
    $('ul.navbar-stats li:nth-child(7)').remove();
    $('ul.navbar-stats li:nth-child(6)').remove();
    $('ul.navbar-stats li:nth-child(5)').remove();

    var subNavBar = $('.loggedin .sub-navbar');
    var topBar = $('.container-fluid').prepend( subNavBar.contents() );
    subNavBar.remove()


    setTimeout(function() {
    $("span.labelfreeleech").parent().parent().parent().siblings(".td-size").children("div.size").css("color", "#FFDF00")
    $('span.labelfreeleech').parent().remove()

    //$("td.td-name .name:not(:has(.imdb-link)) a").each(function(){
    //    $(this).css("margin-left", "45px");
    //});

    $("a.imdb-link span:nth-child(3)").remove()
    $("a.imdb-link").each(function(){
        var imdb = $(this)
        var rating = parseFloat(imdb.text());
        imdb.find('.fa-star').css({transform: "scale(" + (0.2 + (rating - 4) / 6) * 1.5 + ")"});
        imdb.parent().prev().append(imdb)
    });
    }, 200);
}

GM_addStyle(`
div.rounded { display: none; }
.filtering .categories div.category { padding: 0; }
.filtering .categories a.category { padding: 0; }
.searching .tl-search-wrapper input.tl-search { height: 20px; }
.searching .action-btn { margin: 0; }
.mt-20 { margin-top: 3px; }
.mb-10 { margin-bottom: 0px; }
.filtering .categories .category .text { margin-top: 0px; }

.navbar-header { display: none }
.tl.navbar .navbar-form { margin-top: 0px; }
.tl .nav > li > a { padding: 0px 10px; }
.container-fluid .col-xs-4 { display: none }
.col-xs-8 { width: auto; padding: 0px }
.navbar { min-height: auto }
.tl-search-btn-cnt .pull-right { display: none }
.container-fluid ul.col-xs-8 li { padding-top: 3px  }
.mt-10 { margin-top: 3px; }
.navbar-collapse { padding: 0px; }


.results .torrents .torrent .quick-download-img {
    width: 20px;
    height: 20px;
    line-height: 20px;
    position: relative;
}
.results .torrents .torrent .name {
    padding-top: 0px;
}
.results .torrents .torrent .circle {
    width: 30px;
    height: 30px;
}
.results .torrents .torrent .circle i {
    font-size: 28px;
}
#search-app .torrent .td-name {
    padding-left: 18px;
}
.torrents div.info { font-size: 11px !important}
.td-uploaded-time div.time-ago{ font-size: 11px !important }
.results .torrents .torrent .icell { top: 4px }
.td-quick-download { padding-left: 10px !important; }
.results .torrents .torrent .seeders, .results .torrents .torrent .size {
    color: #b8b8b8;
    font-size: 18px;
    //font-family: system-ui, sans-serif;
}

.results .torrents .torrent .leechers, .results .torrents .torrent .snatched {
    color: #8f8f8f;
    font-size: 18px;
    //font-family: Arial, sans-serif;
}
.torrents tr:hover { background-color: #2f2f1b !important; }
tr.odd { background-color: #0f0f0f !important; }
tr.even { background-color: #1b1b1b !important; }
.sq-count { width: 25px; text-align: center; }

.torrents td {
    /* border-top: 1px solid #653a3a; */
    border-bottom: 1px solid #282828 !important;
    border-top: 0px !important;
}

.fa-star { /*  imdb rating star color */
    color: #817434;
}

//.squeezer .name a {
//   line-height: 35px;
//}

.imdb-link {
    float: left; width: 45px;
}

//td.td-name .name:not(:has(.imdb-link)) a {
//    margin-left: 45px;
//}
`)
