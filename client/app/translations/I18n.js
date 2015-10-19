var settings = require('../utils/Settings');
var Polyglot = require('node-polyglot');
var languages = require('./Languages');
var consts = require('../../../shared/constants');
var world = require('../World');

var getDefaultLanguage = function() {
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

var updateLang = function() {
    var langSetting = settings.get(consts.settings.LANGUAGE);
    var lang = langSetting === consts.settings.LANGUAGE.defaultValue ? getDefaultLanguage() : langSetting;
    polyglot.replace(languages[lang]);
};

world.onInit(updateLang);

var polyglot = new Polyglot({
    phrases: languages[getDefaultLanguage()]
});

module.exports = polyglot;
