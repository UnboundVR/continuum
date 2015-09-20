'use strict';

var db = require('./db');
var promise = require('promise');

var create = function(obj) {
    return db.createByAlias('object', 'uuid', obj);
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
    return getMulti([uuid]).then(function(objs) {
        return objs[0];
    });
};

module.exports = {
    create: create,
    get: get
};