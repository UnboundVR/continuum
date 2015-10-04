'use strict';

// Based on http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
// TODO stop receiving css 3d scene as a param, take it from scene obj
define(['Three', 'Scenes', 'Constants'], function(THREE, scenes, constants) {

    var dict = {};

    var insertGUI = function(htmlNode, plane, css3DScene) {
        var cssObject = new THREE.CSS3DObject(htmlNode);
        cssObject.position.copy(plane.position);
        cssObject.rotation.copy(plane.rotation);
        css3DScene.add(cssObject);

        return cssObject;
    };

    var beam = function(htmlNode, planeUUID, css3DScene) {
        css3DScene.remove(dict[planeUUID].current);

        var plane = scenes.getObjectByUUID(planeUUID);
        dict[planeUUID].current = insertGUI(htmlNode, plane, css3DScene);
    };

    var cancel = function(planeUUID, css3DScene) {
        css3DScene.remove(dict[planeUUID].current);
        css3DScene.add(dict[planeUUID].original);

        dict[planeUUID].current = dict[planeUUID].original;
    };

    var embedGUI = function(htmlNode, planeUUID, css3DScene) {
        var plane = scenes.getObjectByUUID(planeUUID);
        var cssObj = insertGUI(htmlNode, plane, css3DScene);

        dict[planeUUID] = {
            original: cssObj,
            current: cssObj
        };

        var material = new THREE.MeshBasicMaterial();
        material.color.set(constants.html.COLOR_BLACK);
        material.opacity = 0;
        material.blending = THREE.NoBlending;
        plane.material = material;
    };

    return {
        embedGUI: embedGUI,
        beam: beam,
        cancel: cancel
    };
});
