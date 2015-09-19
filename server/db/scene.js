'use strict';

var db = require('./db');
var objectDb = require('./object');

var get = function(uuid) {
    return db.getByAlias('scene', 'uuid', uuid).then(function(res) {
        return objectDb.get(res.value.object).then(function(obj) {
            res.value.object = obj;
            return res.value;
        });
    });
};

var create = function(scene) {
    return db.counter('counters::scene', 1, {initial: 1}).then(function(res) {
        return db.insert('scene::' + res.value, scene).then(function() {
            return db.insert('scene::uuid::' + scene.uuid, res.value);
        });
    });
};

module.exports = {
    get: get,
    create: create
};