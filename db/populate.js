'use strict';

var couchbase = require('couchbase');
var json = require('./boilerplate.json');
var async = require('async');
var uuid = require('node-uuid');
var db = require('../server/db/db');
var sceneDb = require('../server/db/scene');
db.init(process.argv[2], process.argv[3], process.argv[4]);

var genUUID = function() {
    return uuid.v4().toUpperCase();
};

var createScene = function(json) {
    var getUuid = function(obj) {
        return obj.uuid;
    };
    
    // FIXME we shouldn't store all the stuff as children of the scene, or else each time we add a new object we should modify the scene in the DB
    // which could bring concurrency issues. We should only store objects as children of the scene (or children of other objects),
    // and store geometries & materials as children of objects (then textures as children of materials, and images as children of textures).
    // As for scripts and GUI, we should also store them as children of objects, which means we need to modify the structure of scene.json (and its parser)
    var scene = {
        uuid: genUUID(),
        object: json.scene.object.uuid
    };
    return sceneDb.create(scene);
};

var loadTextures = function(textures) {
    return function(callback) {
        callback(null);
    };
};

var loadImages = function(images) {
    return function(callback) {
        callback(null);
    };
};

var loadGeometries = function(geometries) {
    return function(callback) {
        callback(null);
    };
};

var loadMaterials = function(materials) {
    return function(callback) {
        callback(null);
    };
};

var loadScripts = function(scripts) {
    return function(callback) {
        callback(null);
    };
};

var loadGUI = function(gui) {
    return function(callback) {
        callback(null);
    };
};

// Scene can have children, and children can have children too (i.e. any object can have children)
var loadObjects = function(sceneObject) {
    return function(callback) {
        callback(null);
    };
};

var scene = json.scene;
createScene(json).then(function(res) {
    async.parallel([
        loadTextures(scene.textures),
        loadImages(scene.images),
        loadGeometries(scene.geometries),
        loadMaterials(scene.materials),
        loadObjects(scene.object),
        loadScripts(json.scripts),
        loadGUI(json.gui)
    ], function(err, res) {
        if(err) {
            console.log(err);
            process.exit(1);
        } else {
            console.log('Database at ' + process.argv[2] + ' populated with boilerplate scene!');
            process.exit();
        }
    }); 
}, function(error) {
    console.log(error);
    process.exit(1);
});