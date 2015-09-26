var express = require('express');

module.exports = function(app) {
    app.use('/client', express.static('client'));
    app.use('/shared', express.static('shared'));
    app.use('/node_modules', express.static('node_modules'));
    app.use('/keyvr', express.static('keyvr'));
};
