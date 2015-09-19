'use strict';

// Based on http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
define(['Three'], function(THREE) {

    var embedHtml = function(element, plane, css3DScene) {
        var cssObject = new THREE.CSS3DObject(element);
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
        embedHtml: embedHtml
    };
});
