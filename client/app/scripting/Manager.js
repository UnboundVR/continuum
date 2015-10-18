var consts = require('../../../shared/constants');
var scenes = require('../Scenes');
var events = require('../Events');
var loadExternal = require('../utils/LoadExternalScript');

var scripts = {};

var app;

var unloadOldScript = function(script, uuid) {
    events.dispatch(consts.events.UNLOAD, null, uuid);
    events.unsubscribeScript(uuid, script.name);
};

var loadScript = function(script, uuid) {
    var scriptExists = function() {
        if (!scripts[uuid]) {
            return false;
        }

        return scripts[uuid].hasOwnProperty(script.name);
    };

    var storeScript = function() {
        if (!scripts[uuid]) {
            scripts[uuid] = {};
        }

        scripts[uuid][script.name] = script.source;
    };

    var subscribeToEvents = function(object) {
        var params = consts.scripts.APP_PARAM + ', ' + consts.scripts.SCENE_PARAM + ', ' + events.list().join(', ');
        var source = script.source + '\nreturn {' + events.list().map(function(key) {
            return key + ': ' + key;
        }).join(', ') + '};';
        var functions = (new Function(params, source).bind(object))(app, scenes.getScene());

        for (var name in functions) {
            if (!functions[name]) {
                continue;
            }

            if (events.list().indexOf(name) == -1) {
                console.warn('Event type not supported (', name, ')');
                continue;
            }

            events.subscribe(name, functions[name].bind(object), object.uuid, script.name);
        }
    };

    if (scriptExists()) {
        unloadOldScript(script, uuid);
    }

    storeScript();

    subscribeToEvents(scenes.getObjectByUUID(uuid));

    if (script.dependencies) {
        var promises = script.dependencies.map(function(dependency) {
            return loadExternal(dependency);
        });

        return Promise.all(promises);
    } else {
        return new Promise(function(resolve, reject) {
            resolve();
        });
    }
};

var getScript = function(objUUID, scriptName) {
    var objScripts = getScripts(objUUID);
    if (objScripts) {
        return objScripts[scriptName];
    }
};

var getScripts = function(objUUID) {
    return scripts[objUUID];
};

var setApp = function(relevantApp) {
    app = relevantApp;
};

module.exports = {
    getScript: getScript,
    getScripts: getScripts,
    loadScript: loadScript,
    setApp: setApp
};
