// ==UserScript==
// @name           TLsqueezer
// @author         paxamit 
// @description    groups all releases of same movies and serials into single expendable row
// @namespace      paxamit
// @include        http://*.torrentleech.org/torrents/*
// @include        https://*.torrentleech.org/torrents/*
// @exclude        http://*classic.torrentleech.org/*
// @exclude        https://*classic.torrentleech.org/*
// @grant          none
// @version        0.24
// @license        MIT
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
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

        return { background: "linear-gradient(to right, #0000 0%,#0000 85%," + color + " 85% ," + color +" 100%)" }
    }

    var elements = $('table.torrents tr')

    elements.each(function() {
        var tr = $(this)
        this.guessed_title = guess_title(tr.find('.name a').text())
        this.guessed_title_lowercase = this.guessed_title.toLowerCase()
        this.seeds = parseInt(tr.find('.seeders').text())
        this.peers = parseInt(tr.find('.leechers').text())
        tr.find('.td-category').css( get_seeds_color_css( this.seeds + this.peers ) )
    })

    for (var x = 0; x < elements.length; ++x) {
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
        if (found_elements.length > 1) {
            var row = '<tr class="torrent squeezer" data-count="' + found_elements.length + '">'
            + '<td class="td-category" style="font-size: 20px; line-height: 44px">'
            + found_elements.length + '</td>'
            + '<td class="td-name"><div class="name"><a href="javascript:">'
            + el.guessed_title + '</a></div></td>'
            + '<td class="td-quickdownload"></td><td></td><td></td><td></td><td></td>'
            + '<td class="td-seeders"><div class="icell seeders">' + seeds + '</div></td>'
            + '<td class="td-leechers"><div class="icell leechers">' + peers + '</div></td><td></td></tr>'

            var new_row = $(el).before(row).prev()
            var ids = $(found_elements.join(','))

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
