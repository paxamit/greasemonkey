// ==UserScript==
// @name           TLsqueezer
// @author         paxamit
// @description    groups all releases of same movies and serials into single expendable row
// @namespace      paxamit
// @match          http://*.torrentleech.org/torrents/*
// @match          https://*.torrentleech.org/torrents/*
// @exclude        http://*classic.torrentleech.org/*
// @exclude        https://*classic.torrentleech.org/*
// @grant          GM_addStyle
// @version        0.3
// @license        MIT
// @require        https://gist.github.com/raw/2625891/waitForKeyElements.js
// @run-at document-end
// ==/UserScript==

waitForKeyElements ("table.torrents", prettyPlease);
function prettyPlease(jNode)
{
    //contentEval(function() {
    //                      movies     serials
    var title_regexp = /.*?([12]\d\d\d|S\d\dE\d\d)/i

    function guess_title(title) {
        var guessed = title_regexp.exec(title)
        return guessed ? guessed[0] : title
    }

    function fix_odd_even() {
        var odd = true
        var count = 0
        var was_odd = false

        $('.torrents tr').each(function () {
            var tr = $(this)
            if (tr.hasClass('squeezer')) {
                count = parseInt(tr.attr('data-count')) + 1
                was_odd = odd
            }
            tr.removeClass('odd even').addClass(odd ? 'odd' : 'even')
            odd = --count == 0 ? !was_odd : !odd
        })
    }

    function get_seeds_color_css(seeds){
        if( seeds < 30 )
            return {}

        var color;

        if( seeds < 50 )
        {
            color = "#1693A7"
        }
        else if( seeds < 100 )
        {
            color = '#C8CF02'
        }
        else if( seeds < 250 )
        {
            color ='#E6781E'
        }
        else
        {
            color = '#CC0C39'
        }

        //return color;
        return { background: "linear-gradient(to left, #0000 0%,#0000 85%," + color + " 85% ," + color +" 100%)" }
    }

    var elements = $('table.torrents tr')

    elements.each(function() {
        var tr = $(this)
        this.guessed_title = guess_title(tr.find('.name a').text())
        this.guessed_title_lowercase = this.guessed_title.toLowerCase()
        this.seeds = parseInt(tr.find('.seeders').text())
        this.peers = parseInt(tr.find('.leechers').text())
        var imdb = tr.find('a.imdb-link')
        this.imdb = imdb ? parseFloat(imdb.text()) : null
        this.imdb_href = imdb && imdb.length > 0 ? imdb[0].href : "https://www.imdb.com/find?q="+this.guessed_title
        //tr.find('.td-category').css( get_seeds_color_css( this.seeds + this.peers ) )
    })

    for (var x = 1; x < elements.length; ++x) {
        var el = elements[x]
        if (el.processed)
            continue

        var found_elements = ["tr[data-tid='" + $(el).attr('data-tid') +"']"]
        var peers = el.peers
        var seeds = el.seeds

        for (var y = elements.length - 1; y > x; y--) {
            var other = elements[y]
            if (!other.processed && el.guessed_title_lowercase == other.guessed_title_lowercase) {
                $(el).after(other);
                other.processed = true
                peers = Math.max(other.peers, peers)
                seeds = Math.max(other.seeds, seeds)
                found_elements.push("tr[data-tid='" + $(other).attr('data-tid') +"']")
            }
        }
        //if (found_elements.length > 1) {
        if (true) {
            var imdb = 0;
            if (el.imdb)
            {
                imdb = Math.min(Math.max(el.imdb - 5, 0), 3.5) / 3.5
            }

            var row = '<tr class="torrent squeezer" data-count="' + found_elements.length + '">'
            + '<td class="td-category" >'
              + '<div class="counter">'
                + '<div class="box"/>'.repeat(found_elements.length > 1 ? found_elements.length : 0)
              + '</div>'
            + '</td>'
            + '<td class="td-name">'
              + (el.imdb ?'<div class=imdb_container>' : '') + '<div class=imdb>'
                + '<a href="' + el.imdb_href + '">' + (el.imdb ? el.imdb : '~') + '</a>'
              + (el.imdb ? '</div>' : '') + '</div>'
              + '<div class="name"><a href="javascript:">' + el.guessed_title + '</a></div>'
            + '</td>'
            + '<td class="td-quickdownload"></td><td></td><td></td><td></td><td></td>'
            + '<td class="td-seeders"><div class="icell seeders">' + seeds + '</div></td>'
            + '<td class="td-leechers"><div class="icell leechers">' + peers + '</div></td><td></td></tr>'

            var new_row = $(el).before(row).prev()
            var ids = $(found_elements.join(','))

            new_row.find('.imdb_container .imdb').css({
                background: el.imdb ? '#f3ce13' : '#f31313',
                height: Math.ceil(imdb * 40).toString() + 'px'
            })
            //new_row.find('.imdb_cintainer').click(function () {
            //    window.open(el.imdb_href, '_blank').focus();
            //})

            ids.hide()
            new_row.find('.td-category').css( get_seeds_color_css( seeds + peers ) )

            if (ids.find('span.new.label.label-danger').length > 0)
                new_row.find('.td-name .name').append('<span class="new label label-danger">new</span>')

            new_row.data('ids', ids)
            new_row.data('show', false)

            ids.find('.name a').each(function () {
                this.innerHTML = this.innerHTML.substr(el.guessed_title.length)
            })

            ids.find('.td-category img').css({position: 'relative', left: '50px' })
            ids.find('td.td-name').prepend('<div style="float: left; width: 55px; height: 20px"></div>')

            new_row.click(function () {
                var show = $(this).data('show')
                var ids  = $(this).data('ids')
                show ? $(ids).hide() : $(ids).show()
                $(this).data('show', !show)
            })

            fix_odd_even()
        }
    }
}
GM_addStyle(`
.squeezer {
    font-family: system-ui !important;
}
.squeezer .td-category {
    text-align: center;
    line-height: 44px;
    width: 40px;
}
.squeezer .counter {
    padding-left:10px;
    padding-top:2px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column-reverse;
    align-content: flex-start;
    height: 40px;
    justify-content: flex-end;
}
.squeezer .counter .box {
    width: 5px;
    height: 5px;
    background-color: #ccc;
    margin: 2px;
}
.squeezer .td-name {
    line-height: 44px;
}
.squeezer .name a {
    padding: 0;
    padding-left: 20px;
    font-size: 17px;
    display:inline-block;
}
.squeezer .imdb {
   float: left;
   text-align: center;
   margin-right: 10px;
   font-size: 22px;
   font-weight: bold;
   width: 40px;
}
.squeezer .imdb_container {
    height: 42px;
    width: 42px;
    float: left;
    margin-top: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: #f3ce13;
}
.squeezer .imdb_container .imdb a {
    color: #ccc;
    font-size: 22px;
    text-shadow: #000 0px 0px 3px, #000 0px 0px 3px, #000 0px 0px 3px,
                 #000 0px 0px 3px, #000 0px 0px 3px; #000 0px 0px 3px;
}
`);
