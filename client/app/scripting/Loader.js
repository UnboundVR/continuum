var consts = require('../../../shared/Constants');
var manager = require('./Manager');
var dictFromArray = require('../utils/DictFromArray');
var traverseTree = require('../../../shared/TraverseTree');

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

module.exports = {
    load: load
};
