'use strict';

var db = require('./db');

var create = function(obj) {
    return db.counter('counters::object', 1, {initial: 1}).then(function(res) {
        return db.insert('object::' + res.value, obj).then(function() {
            return db.insert('object::uuid::' + obj.uuid, res.value);
        });
    });
};

var get = function(uuid) {
    return db.get('object::uuid::' + uuid).then(function(res) {
        return db.get('object::' + res.value);
    });
};

module.exports = {
    create: create,
    get: get
};