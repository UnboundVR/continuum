var consts = require('../../../shared/constants');
var manager = require('./Manager');
var dictFromArray = require('../../../shared/dictFromArray');
var traverse = require('../../../shared/traverseTree');

var load = function(json, app) {
    manager.setApp(app);

    var scriptDict = dictFromArray(json.scripts, 'uuid');

    var allPromises = [];

    traverse(json.scene.object, function(obj) {
        if (obj.scripts && obj.scripts.length) {
            var promises = obj.scripts.map(function(scriptUUID) {
                return manager.loadScript(scriptDict[scriptUUID], obj.uuid);
            });

            allPromises.push(Promise.all(promises));
        }
    });

    return Promise.all(allPromises);
};

module.exports = {
    load: load
};
