'use strict';

var json = require('./scene.json');

var couchbase = require('couchbase');
var promise = require('promise');
var traverse = require('../shared/TraverseTree');

var db = require('../server/db/db');
var sceneDb = require('../server/db/scene');
var objectDb = require('../server/db/object');

var constants = require('../shared/constants');

var env = process.env.NODE_ENV || DEV_ENVIRONMENT;
console.log('Populating DB in ' + env + ' environment');
require('dotenv').load();

db.init(process.env.COUCHBASE_HOST, process.env.BUCKET_NAME, process.env.BUCKET_PASSWORD);

var createScene = function(json) {
    var scene = {
        uuid: json.scene.uuid,
        object: json.scene.object.uuid
    };

    return sceneDb.create(scene);
};

var load = function(items, type) {
    var promises = [];

    items.forEach(function(item) {
        promises.push(db.createByAlias(type, constants.properties.UUID, item));
    });

    return promise.all(promises);
};

var loadObjects = function(sceneObject) {
    var promises = [];

    traverse(sceneObject, function(obj) {
        if (obj.children && obj.children.length) {
            obj.children = obj.children.map(function(child) {
                return child.uuid;
            });
        }

        promises.push(objectDb.create(obj));
    });

    return promise.all(promises);
};

var scene = json.scene;
createScene(json).then(function(res) {
    return promise.all([
        loadObjects(scene.object),
        load(scene.textures, constants.objects.TEXTURE),
        load(scene.images, constants.objects.IMAGE),
        load(scene.geometries, constants.objects.GEOMETRY),
        load(scene.materials, constants.objects.MATERIAL),
        load(json.scripts, constants.objects.SCRIPT),
        load(json.gui, constants.objects.GUI)
    ]);
}).then(function(res) {
    console.log('Database at ' + process.env.COUCHBASE_HOST + ' populated with boilerplate scene!');
    process.exit();
}, function(error) {

    console.log(error);
    process.exit(1);
});
