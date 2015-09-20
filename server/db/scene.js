'use strict';

var db = require('./db');
var objectDb = require('./object');
var promise = require('promise');

var get = function(uuid) {
    var getObjDependencies = function(obj) {
        var deps = {
            geometry: [],
            script: [],
            gui: [],
            material: []
        };
        
        var getDeps = function(objs) {
            objs.forEach(function(item) {
                if(item.geometry) {
                    deps.geometry.push(item.geometry);
                }
                
                if(item.material) {
                    deps.material.push(item.material);
                }
                
                if(item.scripts && item.scripts.length) {
                    deps.script.push.apply(deps.script, item.scripts);
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
    
    var response = {};

    return db.getByAlias('scene', 'uuid', uuid).then(function(scene) {
        return objectDb.get(scene.object).then(function(obj) {
            response.scene = scene;
            scene.object = obj;
            
            var promises = [];
            var objDeps = getObjDependencies(obj);
            
            var resolveDeps = function(type) {
                if(objDeps[type].length) {
                    promises.push(db.getMultiByAlias(type, 'uuid', objDeps[type]));
                } else {
                    promises.push([]);
                }
            };
            
            resolveDeps('geometry');
            resolveDeps('material');
            resolveDeps('gui');
            resolveDeps('script');
            
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