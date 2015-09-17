'use strict';

var db = require('./db');

var get = function(sceneId) {
    return db.get('scene::' + sceneId);
};

module.exports = {
    get: get
};