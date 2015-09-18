'use strict';

var couchbase = require('couchbase');
var promise = require('promise');
var json = require('./boilerplate.json');
var uuid = require('node-uuid');
var db = require('../server/db/db');
var sceneDb = require('../server/db/scene');
var objectDb = require('../server/db/object');

db.init(process.argv[2], process.argv[3], process.argv[4]);

var genUUID = function() {
    return uuid.v4().toUpperCase();
};

// We shouldn't store all the stuff as children of the scene, or else each time we add a new object we should modify the scene in the DB
// which could bring concurrency issues. We should only store objects as children of the scene (or children of other objects),
// and store geometries & materials as children of objects (then textures as children of materials, and images as children of textures).
// As for scripts and GUI, we should also store them as children of objects, which means we need to modify the structure of scene.json (and its parser)

var createScene = function(json) {
    var scene = {
        uuid: genUUID(),
        object: json.scene.object.uuid
    };
    
    console.log('Creating scene with this UUID: ' + scene.uuid);
    
    return sceneDb.create(scene);
};

var load = function(items, itemDb) {
    var promises = [];
    
    items.forEach(function(item) {
        promises.push(itemDb.create(item));
    });
    
    return promise.all(promises);
};

var loadObjects = function(sceneObject) {    
    var promises = [];
    
    var doLoadObj = function(obj) {
        delete obj.children;
        promises.push(objectDb.create(obj));
    };
    
    var loadObjs = function(objs) {
        objs.forEach(function(obj) {
            if(obj.children && obj.children.length) {
                loadObjs(obj.children);
            }
            
            doLoadObj(obj);
        });
    };
    
    loadObjs([sceneObject]);
    return promise.all(promises);
};

var scene = json.scene;
createScene(json).then(function(res) {
    return promise.all([
        loadObjects(scene.object),
        /*load(scene.textures, textureDb),
        load(scene.images, imageDb),
        load(scene.geometries, geometryDb),
        load(scene.materials, materialDb),
        load(json.scripts, scriptDb),
        load(json.gui, guiDb)*/
    ]);
}).then(function(res) {
    console.log('Database at ' + process.argv[2] + ' populated with boilerplate scene!');
    process.exit(); 
}, function(error) {
    console.log(error);
    process.exit(1);
});