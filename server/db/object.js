var db = require('./db');
var promise = require('promise');
var consts = require('../../shared/constants');

var create = function(obj) {
    return db.createByAlias(consts.db.OBJECT, 'uuid', obj);
};

var getMulti = function(uuids) {
    return db.getMultiByAlias(consts.db.OBJECT, 'uuid', uuids).then(function(objects) {
        var promises = objects.map(function(obj) {
            if (obj.children && obj.children.length) {
                return getMulti(obj.children);
            } else {
                return [];
            }
        });

        return promise.all(promises).then(function(results) {
            for (var i = 0; i < objects.length; i++) {
                var children = results[i];
                if (children.length) {
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
