'use strict';

define(['ScriptsManager', 'utils/DictFromArray'], function(scriptsManager, dictFromArray) {
    var load = function(json, app) {
        scriptsManager.setApp(app);
        
        var scriptDict = dictFromArray(json.scripts, 'uuid');
        
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
