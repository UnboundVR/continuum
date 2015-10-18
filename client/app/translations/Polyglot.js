var Polyglot = require('node-polyglot');

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var languages = {
    'en': require('./locales/en-US'),
    'es': require('./locales/es-AR')
};

// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

var getLanguage = function() {
    var defaultLanguage = 'en';

    if(navigator.language) {
        var lang = navigator.language.substring(2);

        if(languages[lang]) {
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
