// Based on http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
var consts = require('../../../shared/Constants');
var three = require('three.js');
var scenes = require('../Scenes');

var dict = {};

var insertGUI = function(htmlNode, plane) {
    var cssObject = new three.CSS3DObject(htmlNode);
    cssObject.position.copy(plane.position);
    cssObject.rotation.copy(plane.rotation);
    scenes.getCSS3DScene().add(cssObject);

    return cssObject;
};

var beam = function(htmlNode, planeUUID, css3DScene) {
    scenes.getCSS3DScene().remove(dict[planeUUID].current);

    var plane = scenes.getObjectByUUID(planeUUID);
    dict[planeUUID].current = insertGUI(htmlNode, plane);
};

var cancel = function(planeUUID) {
    var css3DScene = scenes.getCSS3DScene();
    css3DScene.remove(dict[planeUUID].current);
    css3DScene.add(dict[planeUUID].original);

    dict[planeUUID].current = dict[planeUUID].original;
};

var embedGUI = function(htmlNode, planeUUID) {
    var plane = scenes.getObjectByUUID(planeUUID);
    var cssObj = insertGUI(htmlNode, plane);

    dict[planeUUID] = {
        original: cssObj,
        current: cssObj
    };

    var material = new three.MeshBasicMaterial();
    material.color.set(consts.html.COLOR_BLACK);
    material.opacity = 0;
    material.blending = three.NoBlending;
    plane.material = material;
};

module.exports = {
    embedGUI: embedGUI,
    beam: beam,
    cancel: cancel
};
