'use strict';

define(['Three', 'Scene', 'FirstPersonControls'], function(THREE, scene, controls) {
    var mouse = new THREE.Vector2();
    
    // TODO take this from a serious place (e.g. excluded objects could have a flag in scene.json?)
    var excludedObjects = ['Floor', 'Skybox'];

    // Based on the example in http://threejs.org/docs/#Reference/Core/Raycaster
    var onMouseMove = function(event) {
        mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight ) * 2 + 1;		
    };
    
    var loop = function() {
        /* This would use the mouse position, not the reticle position. Might be useful in the future (e.g. for KeyVR)
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(controls.camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());
        */
        
        // FIXME This magic vector was taken from https://github.com/neuman/vreticle
        // It probably represents the position of the reticle.
        var vector = new THREE.Vector3(-0.0012499999999999734, -0.0053859964093356805, 0.5);
        vector.unproject(controls.camera);
        var raycaster = new THREE.Raycaster(controls.getPosition(), vector.sub(controls.getPosition()).normalize());
        
        var intersects = raycaster.intersectObjects(scene.getScene().children);
        if(intersects.length) {
            var intersectedObject = intersects[0].object;
            if(!excludedObjects.some(function(exc) {
                return exc == intersectedObject.name;
            })) {
                console.log(intersectedObject.name);
            }
        }
    };
    
    var createReticle = function() {
        var geometry = new THREE.SphereGeometry(0.05, 10, 10);
        var material = new THREE.MeshBasicMaterial();
        material.color.set(0x000000);
        
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = -10;
        
        return mesh;
    };
    
    var init = function() {
        window.addEventListener('mousemove', onMouseMove, false);
        
        var reticleContainer = new THREE.Object3D();
        reticleContainer.add(reticle);
        controls.camera.add(reticleContainer);
    };
    
    var reticle = createReticle();

    return {
        loop: loop,
        init: init
    };
});