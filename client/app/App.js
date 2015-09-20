'use strict';

define(['Three', 'Detector', 'FirstPersonControls', 'Renderer', 'DomContainer', 'Scene', 'loaders/ObjectLoader', 'loaders/GUILoader', 'loaders/ScriptsLoader', 'QueryString', 'Loop', 'World'],
    function(THREE, detector, fpControls, renderer, container, scene, objectLoader, guiLoader, scriptsLoader, queryString, loop, world) {
        // TODO use same style as other objects
        var App = function() {
            var camera;

            this.load = function(json) {
                scene.setScene(objectLoader.parse(json.scene));
                scene.setCSS3DScene(guiLoader.parse(json));

                // Perhaps we could pass more things -- the most important thing is that later on we document which things we expose to scripts
                // We can also pass things like renderer directly as params (such as when we pass scene) but I think it's OK to pass just scene as a distinct param
                var relevantApp = {
                    setCamera: this.setCamera,
                    setSize: this.setSize,
                    play: world.play,
                    stop: world.stop,
                    renderer: renderer
                };

                scriptsLoader.load(json, relevantApp);
                this.setCamera(fpControls.camera);
            };

            this.setCamera = function(value) {
                camera = value;
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
            };

            this.setSize = function(width, height) {
                this.width = width;
                this.height = height;

                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            };

            this.init = function() {
                if (!detector.webgl) {
                    detector.addGetWebGLMessage();
                    return;
                }
    
                var _this = this;

                var remoteLoader = new THREE.XHRLoader();
                
                var sceneId = queryString.sceneId;
                var url = sceneId ? 'api/scene/' + sceneId : 'api/scene';
                
                remoteLoader.load(url, function(text) {
                    _this.load(JSON.parse(text));
                    _this.setSize(window.innerWidth, window.innerHeight);

                    // TODO move this to render
                    loop.onLoop(function() {
                       renderer.render(scene, camera); 
                    });
                    
                    world.start();
                    
                    container.appendChild(renderer.domElement);

                    // TODO move this to render
                    window.addEventListener('resize', function() {
                        _this.setSize(window.innerWidth, window.innerHeight);
                    });
                });
            };
        };

        new App().init();
    });
