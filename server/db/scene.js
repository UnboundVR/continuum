'use strict';

var db = require('./db');

var get = function(uuid) {
    return db.get('scene::uuid::' + uuid).then(function(res) {
        return db.get('scene::' + res.value);
    });
};

var create = function(scene) {
    return db.counter('counters::scene', 1, {initial: 0}).then(function(res) {
        return db.insert('scene::' + res.value, scene).then(function() {
            return db.insert('scene::uuid::' + scene.uuid, res.value);
        });
    });
};

module.exports = {
    get: get,
    create: create
};