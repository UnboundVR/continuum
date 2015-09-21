'use strict';

var json = require('./scene.json');

var couchbase = require('couchbase');
var promise = require('promise');
var traverse = require('../shared/TraverseTree');

var db = require('../server/db/db');
var sceneDb = require('../server/db/scene');
var objectDb = require('../server/db/object');

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
        promises.push(db.createByAlias(type, 'uuid', item));
    });
    
    return promise.all(promises);
};

var loadObjects = function(sceneObject) {    
    var promises = [];
    
    traverse(sceneObject, function(obj) {
        if(obj.children && obj.children.length) {
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
        load(scene.textures, 'texture'),
        load(scene.images, 'image'),
        load(scene.geometries, 'geometry'),
        load(scene.materials, 'material'),
        load(json.scripts, 'script'),
        load(json.gui, 'gui')
    ]);
}).then(function(res) {
    console.log('Database at ' + process.env.COUCHBASE_HOST + ' populated with boilerplate scene!');
    process.exit(); 
}, function(error) {
    console.log(error);
    process.exit(1);
});