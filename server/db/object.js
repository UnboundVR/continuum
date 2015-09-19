'use strict';

var db = require('./db');
var promise = require('promise');

var create = function(obj) {
    return db.counter('counters::object', 1, {initial: 1}).then(function(res) {
        return db.insert('object::' + res.value, obj).then(function() {
            return db.insert('object::uuid::' + obj.uuid, res.value);
        });
    });
};

var getMulti = function(uuids) {
    return db.getMultiByAlias('object', 'uuid', uuids).then(function(objects) {
        var promises = [];
        
        objects.forEach(function(obj) {
            if(obj.children && obj.children.length) {
                promises.push(getMulti(obj.children));
            } else {
                promises.push([]);
            }
        });
        
        return promise.all(promises).then(function(results) {
            for(var i = 0; i < objects.length; i++) {
                var children = results[i];
                if(children.length) {
                    objects[i].children = children;
                }
            }
            return objects;
        });
    });
};

var get = function(uuid) {
    return getMulti([uuid]);
};

module.exports = {
    create: create,
    get: get
};