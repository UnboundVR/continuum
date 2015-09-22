'use strict';

// Based on http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
define(['Three', 'Scene'], function(THREE, scene) {

    var embedGUI = function(guiElement, planeUUID, css3DScene) {
        if (guiElement.css) {
            var cssNode = document.createElement('style');
            cssNode.innerHTML = guiElement.css;
            document.body.appendChild(cssNode);
        }

        var htmlNode = document.createElement('div');
        htmlNode.innerHTML = guiElement.html;

        var plane = scene.getObjectByUUID(planeUUID);
        var cssObject = new THREE.CSS3DObject(htmlNode);
        cssObject.position.copy(plane.position);
        cssObject.rotation.copy(plane.rotation);

        var material = new THREE.MeshBasicMaterial();
        material.color.set('black');
        material.opacity   = 0;
        material.blending  = THREE.NoBlending;
        plane.material = material;

        css3DScene.add(cssObject);
    };

    return {
        embedGUI: embedGUI
    };
});
