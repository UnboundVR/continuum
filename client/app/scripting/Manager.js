'use strict';

define(['Scenes', 'Constants', './Events'], function(scenes, constants, events) {
    var scripts = {};

    var app;

    var unloadOldScript = function(script, uuid) {
        events.dispatch(events.list.unload, null, uuid);

        for (var name in events) {
            events.list[name].list = events.list[name].list.filter(function(handler) {
                return handler.uuid !== uuid || handler.scriptName !== script.name;
            });
        }
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

        if (scriptExists()) {
            unloadOldScript(script, uuid);
        }

        storeScript();

        var object = scenes.getObjectByUUID(uuid);
        var params = constants.scripts.APP_PARAM + ', ' + constants.scripts.SCENE_PARAM + ', ' + Object.keys(events.list).join(', ');
        var source = script.source + '\nreturn {' + Object.keys(events.list).map(function(key) {
            return key + ': ' + key;
        }).join(', ') + '};';
        var functions = (new Function(params, source).bind(object))(app, scenes.getScene());

        for (var name in functions) {
            if (!functions[name]) {
                continue;
            }

            if (!events.list[name]) {
                console.warn('Event type not supported (', name, ')');
                continue;
            }

            events.list[name].list.push({
                func: functions[name].bind(object),
                uuid: object.uuid,
                scriptName: script.name
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

    return {
        getScript: getScript,
        getScripts: getScripts,
        loadScript: loadScript,
        setApp: setApp
    };
});
