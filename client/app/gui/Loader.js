var consts = require('../../../shared/constants');
var scenes = require('../Scenes');
var manager = require('./Manager');
var dictFromArray = require('../../../shared/dictFromArray');
var traverse = require('../../../shared/traverseTree');
var buildHTMLNode = require('../utils/BuildHTMLNode');
var THREE = require('three.js');

var load = function(json) {
    var css3DScene = new THREE.Scene();
    scenes.setCSS3DScene(css3DScene);

    var guiDict = dictFromArray(json.gui, 'uuid');

    traverse(json.scene.object, function(obj) {
        if (obj.gui) {
            var guiObj = guiDict[obj.gui];
            var htmlNode = buildHTMLNode(guiObj.html, guiObj.css);
            manager.embedGUI(htmlNode, obj.uuid);
        }
    });

    return css3DScene;
};

module.exports = {
    load: load
};
