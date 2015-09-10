// Based on http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/

define(['Three', 'scene'], function(THREE, scene) {
	
	var embedHtml = function(element, plane) {
		var cssObject = new THREE.CSS3DObject(element);
		cssObject.position = plane.position;
		cssObject.rotation = plane.rotation;
		
		scene.getCSS3DScene().add(cssObject);
	};
	
    return {
		embedHtml: embedHtml
	};
});
