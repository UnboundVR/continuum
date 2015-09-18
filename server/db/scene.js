'use strict';

var db = require('./db');
var objectDb = require('./object');

var get = function(uuid) {
    return db.get('scene::uuid::' + uuid).then(function(res) {
        return db.get('scene::' + res.value).then(function(res2) {
            return objectDb.get(res2.value.object).then(function(res3) {
                res2.value.object = res3.value;
                return res2;
            });
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