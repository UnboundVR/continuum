'use strict';

var couchbase = require('couchbase');
var promise = require('promise');
var json = require('./boilerplate.json');
var db = require('../server/db/db');

var sceneDb = require('../server/db/scene');
var objectDb = require('../server/db/object');

db.init(process.argv[2], process.argv[3], process.argv[4]);

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
        promises.push(db.createByAlias(type, 'uuid', item));
    });
    
    return promise.all(promises);
};

var loadObjects = function(sceneObject) {    
    var promises = [];
    
    var onlyUuid = function(obj) {
        return obj.uuid;
    };
    
    var doLoadObj = function(obj) {
        if(obj.children && obj.children.length) {
            obj.children = obj.children.map(onlyUuid);
        }
        
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
        load(scene.textures, 'texture'),
        load(scene.images, 'image'),
        load(scene.geometries, 'geometry'),
        load(scene.materials, 'material'),
        load(json.scripts, 'script'),
        load(json.gui, 'gui')
    ]);
}).then(function(res) {
    console.log('Database at ' + process.argv[2] + ' populated with boilerplate scene!');
    process.exit(); 
}, function(error) {
    console.log(error);
    process.exit(1);
});