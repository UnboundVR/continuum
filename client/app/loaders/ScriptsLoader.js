'use strict';

define(['ScriptsManager'], function(scriptsManager) {
    var load = function(json, app) {
        scriptsManager.setApp(app);
        
        var scriptDict = {};
        json.scripts.forEach(function(entry) {
            scriptDict[entry.uuid] = {
                name: entry.name,
                source: entry.source
            };
        });
        
        var loadScripts = function(objs) {
            objs.forEach(function(obj) {
                if (obj.scripts && obj.scripts.length) {
                    obj.scripts.forEach(function(scriptUUID) {
                        scriptsManager.loadScript(scriptDict[scriptUUID], obj.uuid);
                    });
                }

                if (obj.children) {
                    loadScripts(obj.children);
                }
            });
        };
        
        loadScripts([json.scene.object]);
    };

    return {
        load: load
    };
});
