var Polyglot = require('node-polyglot');

var locale = 'en_US'; // TODO infer locale

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var locales = {
    en_US: require('./locales/en_US'),
    es_AR: require('./locales/es_AR')
};

// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

var polyglot = new Polyglot({
    phrases: locales[locale]
});

module.exports = polyglot;
