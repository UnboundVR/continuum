'use strict';

define(['GUIManager', 'utils/DictFromArray'], function(gui, dictFromArray) {

    var parse = function(json) {
        var css3DScene = new THREE.Scene();

        var guiDict = dictFromArray(json.gui, 'uuid');

        var embedHtml = function(objUUID, guiUUID) {
            var guiElement = guiDict[guiUUID];

            if (guiElement.css) {
                var cssNode = document.createElement('style');
                cssNode.innerHTML = guiElement.css;
                document.body.appendChild(cssNode);
            }

            var htmlNode = document.createElement('div');
            htmlNode.innerHTML = guiElement.html;
            gui.embedHtml(htmlNode, objUUID, css3DScene);
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
