'use strict';

define(['GUIManager', 'utils/DictFromArray', 'shared/TraverseTree', 'Constants'], function(gui, dictFromArray, traverse, constants) {

    var parse = function(json) {
        var css3DScene = new THREE.Scene();

        var guiDict = dictFromArray(json.gui, constants.properties.UUID);

        traverse(json.scene.object, function(obj) {
            if (obj.gui) {
                gui.embedGUI(guiDict[obj.gui], obj.uuid, css3DScene);
            }
        });

        return css3DScene;
    };

    return {
        parse: parse
    };
});
