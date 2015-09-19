'use strict';

var db = require('./db');
var objectDb = require('./object');

var get = function(uuid) {
    return db.getByAlias('scene', 'uuid', uuid).then(function(scene) {
        return objectDb.get(scene.object).then(function(obj) {
            scene.object = obj;
            return scene;
        });
    });
};

var create = function(scene) {
    return db.createByAlias('scene', 'uuid', scene);
};

module.exports = {
    get: get,
    create: create
};