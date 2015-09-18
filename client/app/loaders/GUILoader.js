    'use strict';

define(['GUI', 'Scene'], function(gui, scene) {

    var guiStore = {};

    var parse = function(json) {
        var css3DScene = new THREE.Scene();

        var guiDict = {};
        json.gui.forEach(function(entry) {
            guiDict[entry.uuid] = {
                html: entry.html,
                css: entry.css
            };
        });

        var embedHtml = function(objUUID, guiUUID) {
            var panel = scene.getObjectByUUID(objUUID);
            var guiElement = guiDict[guiUUID];

            if (guiElement.css) {
                var cssNode = document.createElement('style');
                cssNode.innerHTML = guiElement.css;
                document.body.appendChild(cssNode);
            }

            var htmlNode = document.createElement('div');
            htmlNode.innerHTML = guiElement.html;
            gui.embedHtml(htmlNode, panel, css3DScene);
        };

        var loadGuiForObjects = function(objs) {
            objs.forEach(function(obj) {
                if (obj.gui) {
                    embedHtml(obj.uuid, obj.gui);
                }

                if (obj.children) {
                    loadGuiForObjects(obj.children);
                }
            });
        };

        loadGuiForObjects([json.scene.object]);

        return css3DScene;
    };

    return {
        parse: parse
    };
});
