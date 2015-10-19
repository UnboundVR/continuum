var express = require('express');
var consts = require('./shared/constants');

module.exports = function(app) {
    app.use(consts.routes.BUILD, express.static('build'));
    app.use(consts.routes.ASSETS, express.static('assets'));
    app.use(consts.routes.NODE_MODULES, express.static('node_modules'));
    app.use(consts.routes.SHARED, express.static('shared'));
    app.use(consts.routes.KEYVR, express.static('keyvr'));
};
