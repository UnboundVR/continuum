var Polyglot = require('node-polyglot');
var languages = require('./Languages');

var getLanguage = function() {
    var defaultLanguage = 'en';

    if (navigator.language) {
        var lang = navigator.language.substring(2);

        if (languages[lang]) {
            return lang;
        } else {
            return defaultLanguage;
        }
    }

    return defaultLanguage;
};

var polyglot = new Polyglot({
    phrases: languages[getLanguage()]
});

module.exports = polyglot;
