'use strict';

define(['GUI', 'Scene'], function(gui, scene) {

    var parse = function(json) {
        var css3DScene = new THREE.Scene();

        for (var uuid in json) {
            var object = scene.getObjectByUUID(uuid);
            var guiElement = json[uuid];

            if (guiElement.css) {
                var cssNode = document.createElement('style');
                cssNode.innerHTML = guiElement.css;
                document.body.appendChild(cssNode);
            }

            var htmlNode = document.createElement('div');
            htmlNode.innerHTML = guiElement.html;
            gui.embedHtml(htmlNode, object, css3DScene);
        }

        return css3DScene;
    };

    return {
        parse: parse
    };
});
