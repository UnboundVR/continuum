'use strict';

var db = require('./db');
var objectDb = require('./object');
var promise = require('promise');

var getObjDependencies = function(obj) {
    var deps = {
        geometries: [],
        scripts: [],
        gui: [],
        materials: []
    };
    
    var getDeps = function(objs) {
        objs.forEach(function(item) {
            if(item.geometry) {
                deps.geometries.push(item.geometry);
            }
            
            if(item.material)
            {
                deps.materials.push(item.material);
            }
            
            if(item.scripts && item.scripts.length) {
                deps.scripts.push.apply(deps.scripts, item.scripts);
            }
            
            if(item.gui) {
                deps.gui.push(item.gui);
            }
            
            if(item.children && item.children.length) {
                getDeps(item.children);
            }
        });
    };
    
    getDeps([obj]);
    
    return deps;
};

var getMaterialDependencies = function(materials) {
    return materials.filter(function(material) {
        return material.map;
    }).map(function(material) {
       return material.map; 
    });
};

var getTextureDependencies = function(textures) {
    return textures.map(function(texture) {
       return texture.image; 
    });
};

var get = function(uuid) {
    var response = {};
    return db.getByAlias('scene', 'uuid', uuid).then(function(scene) {
        return objectDb.get(scene.object).then(function(obj) {
            response.scene = scene;
            scene.object = obj;
            
            var promises = [];
            
            var objDeps = getObjDependencies(obj);
            
            if(objDeps.geometries.length) {
                promises.push(db.getMultiByAlias('geometry', 'uuid', objDeps.geometries));
            } else {
                promises.push([]);
            }

            if(objDeps.materials.length) {
                promises.push(db.getMultiByAlias('material', 'uuid', objDeps.materials));
            } else {
                promises.push([]);
            }
            
            if(objDeps.gui.length) {
                promises.push(db.getMultiByAlias('gui', 'uuid', objDeps.gui));
            } else {
                promises.push([]);
            }
            
            if(objDeps.scripts.length) {
                promises.push(db.getMultiByAlias('script', 'uuid', objDeps.scripts));
            } else {
                promises.push([]);
            }
            
            return promise.all(promises).then(function(results) {
                scene.geometries = results[0];
                scene.materials = results[1];
                response.gui = results[2];
                response.scripts = results[3];
                
                var matDeps = getMaterialDependencies(scene.materials);
                if(matDeps.length) {
                    return db.getMultiByAlias('texture', 'uuid', matDeps).then(function(textures) {
                        scene.textures = textures;
                        return db.getMultiByAlias('image', 'uuid', getTextureDependencies(textures)).then(function(images) {
                           scene.images = images;
                           return response;
                        });
                    });
                } else {
                    return response;
                }
            });
        });
    });
};

var create = function(scene) {
    return db.createByAlias('scene', 'uuid', scene);
};

module.exports = {
    get: get,
    create: create
};