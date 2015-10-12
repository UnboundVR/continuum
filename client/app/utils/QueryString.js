

define([], function() {
    var AMPERSAND = '&';
    var EQUALS = '=';

    var pairs = location.search.slice(1).split(AMPERSAND);

    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split(EQUALS);
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return result;
});
