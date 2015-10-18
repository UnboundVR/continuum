var Polyglot = require('node-polyglot');

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var locales = {
    'en-US': require('./locales/en-US'),
    'es-AR': require('./locales/es-AR')
};

// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

var polyglot = new Polyglot({
    phrases: locales[navigator.language] || locales[defaultLocale]
});

module.exports = polyglot;
