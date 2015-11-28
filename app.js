'use strict';

var searchfield = document.getElementById("searchfield");
var results = document.getElementById("results");

// For FirefoxOS, we want the Enter key to dismiss the on-screen keyboard.
// Desktop doesn't have an on-screen keyboard, so Enter shouldn't lose focus.
if (navigator.userAgent.search('Mobile') !== -1) {
    searchfield.addEventListener("keypress", blur_on_enter, false);
    // The autofocus attribute doesn't bring up the keyboard in FxOS.
    searchfield.focus();
}

function blur_on_enter(keyevent) {
    // keyCode is deprecated, but non-Firefox-desktop doesn't support key.
    if (keyevent.keyCode === 13 || keyevent.key === "Enter") {
        searchfield.blur();
    }
}

searchfield.addEventListener("input", on_keystroke, false);

function on_keystroke() {
    var serĉo = searchfield.value.trim();
    if (serĉo === '') {
        results.innerHTML = '';
    } else {
        results.innerHTML = makehtml(search(serĉo));
    }
}

// Given a list of match indices into espdic, display them as HTML.
function makehtml(matchlist) {
    if (matchlist.length === 0) {
        return '<div class="resultrow" lang="eo">Nenio trovita.</span>';
    }

    var resultlen = Math.min(matchlist.length, 20);

    var html = "";
    for (var i = 0; i < resultlen; ++i) {
        var entry = espdic[matchlist[i]];

        html += '<div class="resultrow">';
        html += '<span class="eo-result" lang="eo">' + entry[0] + '</span>';

        // Se la vorto estas verbo, montru ankaŭ ĝian transitivecon.
        if (entry[0][entry[0].length - 1] === 'i') {
            var transitiveco = trovu_transitivecon(entry[0]);
            if (transitiveco.length !== 0) {
                html += ' <span class="eo-informacio" lang="eo">(' + transitiveco + ')</span>';
            }
        }

        // Add a space between eo-result and en-result for screen readers.
        html += ' ';

        html += '<span class="en-result" lang="en">' + entry.slice(1).join(', ') + '</span>';

        var etym = find_etymology(entry[0]);
        if (etym.length > 0) {
            html += '<div class="etym-result">' + etym + '</div>';
        }
        html += '</div>';
    }

    return html;
}
