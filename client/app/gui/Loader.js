var consts = require('../../../shared/Constants');
var scenes = require('../Scenes');
var manager = require('./Manager');
var dictFromArray = require('../utils/DictFromArray');
var traverseTree = require('../../../shared/TraverseTree');
var buildHTMLNode = require('../utils/BuildHTMLNode');

var load = function(json) {
    var css3DScene = new three.Scene();
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

module.exports = {
    load: load
};
