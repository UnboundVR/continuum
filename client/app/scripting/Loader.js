'use strict';

define(['./Manager', 'utils/DictFromArray', 'shared/TraverseTree', 'Constants'], function(scriptsManager, dictFromArray, traverse, constants) {
    var load = function(json, app) {
        scriptsManager.setApp(app);

        var scriptDict = dictFromArray(json.scripts, 'uuid');

        traverse(json.scene.object, function(obj) {
            if (obj.scripts && obj.scripts.length) {
                obj.scripts.forEach(function(scriptUUID) {
                    scriptsManager.loadScript(scriptDict[scriptUUID], obj.uuid);
                });
            }
        });
    };

    return {
        load: load
    };
});