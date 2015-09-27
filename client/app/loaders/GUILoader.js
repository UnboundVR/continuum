'use strict';

define(['GUIManager', 'utils/DictFromArray', 'shared/TraverseTree', 'utils/BuildHTMLNode', 'Constants'], function(gui, dictFromArray, traverse, buildHTMLNode, constants) {

    var parse = function(json) {
        var css3DScene = new THREE.Scene();

        var guiDict = dictFromArray(json.gui, constants.properties.UUID);

        traverse(json.scene.object, function(obj) {
            if (obj.gui) {
                var guiObj = guiDict[obj.gui];
                var htmlNode = buildHTMLNode(guiObj.html, guiObj.css);
                gui.embedGUI(htmlNode, obj.uuid, css3DScene);
            }
        });

        return css3DScene;
    };

    return {
        parse: parse
    };
});
