'use strict';

define(['Three', 'Scene', 'FirstPersonControls'], function(THREE, scene, controls) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // Based on the example in http://threejs.org/docs/#Reference/Core/Raycaster
    var onMouseMove = function(event) {
        mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight ) * 2 + 1;		
    };
    
    var loop = function() {
        raycaster.ray.origin.copy(controls.getPosition());
        raycaster.ray.direction.set(mouse.x, mouse.y, 0.5).unproject(controls.camera).sub(controls.getPosition()).normalize();
        var intersects = raycaster.intersectObjects(scene.getScene().children);

        for (var i = 0; i < intersects.length; i++) {
            if(intersects[i].object.name !== 'Skybox') {
                console.log(intersects[i].object.name);
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