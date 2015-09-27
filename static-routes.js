var express = require('express');
var constants = require('./shared/constants');

module.exports = function(app) {
    app.use(constants.routes.CLIENT, express.static('client'));
    app.use(constants.routes.SHARED, express.static('shared'));
    app.use(constants.routes.NODE_MODULES, express.static('node_modules'));
    app.use(constants.routes.KEYVR, express.static('keyvr'));
    app.use('/voicetest', express.static('voicetest')); // eventually this entry will be removed
};
