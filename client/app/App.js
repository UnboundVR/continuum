'use strict';

define(['Three', 'FirstPersonControls', 'Renderer', 'DomContainer', 'Scene', 'PlayerSync', 'loaders/ObjectLoader', 'loaders/GUILoader', 'loaders/ScriptsLoader', 'ScriptsManager', 'Reticle', 'ItemSelector', 'PointerLock', 'QueryString', 'Loop'],
    function(THREE, fpControls, renderer, container, scene, playerSync, objectLoader, guiLoader, scriptsLoader, scripts, reticle, itemSelector, pointerLock, queryString, loop) {
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
                    play: this.play,
                    stop: this.stop,
                    renderer: renderer,
                    playerSync: playerSync
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

            this.play = function() {
                scripts.addEventListeners();

                loop.start();
            };

            this.stop = function() {
                scripts.removeEventListeners();

                loop.stop();
            };

            this.init = function() {
                var _this = this;

                var remoteLoader = new THREE.XHRLoader();
                
                var sceneId = queryString.sceneId;
                var url = sceneId ? 'api/scene/' + sceneId : 'api/scene';
                
                remoteLoader.load(url, function(text) {
                    _this.load(JSON.parse(text));
                    _this.setSize(window.innerWidth, window.innerHeight);

                    fpControls.init();
                    playerSync.init();
                    reticle.init();
                    itemSelector.init();
                    pointerLock.init();
                    scripts.init();
                    
                    loop.onLoop(function() {
                       renderer.render(scene, camera); 
                    });
                    
                    _this.play();
                    
                    container.appendChild(renderer.domElement);

                    window.addEventListener('resize', function() {
                        _this.setSize(window.innerWidth, window.innerHeight);
                    });
                });
            };
        };

        return new App();
    });
