

define(['./Manager', 'utils/DictFromArray', 'shared/TraverseTree', 'Constants'], function(scriptsManager, dictFromArray, traverse, constants) {
    var load = function(json, app) {
        scriptsManager.setApp(app);

        var scriptDict = dictFromArray(json.scripts, 'uuid');

        var allPromises = [];

        traverse(json.scene.object, function(obj) {
            if (obj.scripts && obj.scripts.length) {
                var promises = obj.scripts.map(function(scriptUUID) {
                    return scriptsManager.loadScript(scriptDict[scriptUUID], obj.uuid);
                });

                allPromises.push(Promise.all(promises));
            }
        });

        return Promise.all(allPromises);
    };

    return {
        load: load
    };
});
