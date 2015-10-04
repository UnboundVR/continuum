'use strict';

define(['Scenes', './Manager', 'utils/DictFromArray', 'shared/TraverseTree', 'utils/BuildHTMLNode', 'Constants'], function(scenes, gui, dictFromArray, traverse, buildHTMLNode, constants) {

    var load = function(json) {
        var css3DScene = new THREE.Scene();
        scenes.setCSS3DScene(css3DScene);

        var guiDict = dictFromArray(json.gui, 'uuid');

        traverse(json.scene.object, function(obj) {
            if (obj.gui) {
                var guiObj = guiDict[obj.gui];
                var htmlNode = buildHTMLNode(guiObj.html, guiObj.css);
                gui.embedGUI(htmlNode, obj.uuid);
            }
        });

        return css3DScene;
    };

    return {
        load: load
    };
});
