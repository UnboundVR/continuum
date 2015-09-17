'use strict';

var couchbase = require('couchbase');
var json = require('./boilerplate.json');
var async = require('async');
var uuid = require('node-uuid');
var db = require('../server/api/db/db');
var sceneDb = require('../server/api/db/scene');
db.init(process.argv[2], process.argv[3], process.argv[4]);

var genUUID = function() {
    return uuid.v4().toUpperCase();
};

var createScene = function(json) {
    var scene = {
        uuid: genUUID(),
        object: null,
        textures: null,
        images: null,
        geometries: null,
        materials: null,
        scripts: null,
        gui: null,
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