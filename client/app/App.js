'use strict';

define(['Three', 'FirstPersonControls', 'Renderer', 'DomContainer', 'Scene', 'PlayerSync', 'loaders/ObjectLoader', 'loaders/GUILoader', 'loaders/ScriptsLoader', 'Reticle', 'PointerLock'],
    function(THREE, fpControls, renderer, container, scene, playerSync, objectLoader, guiLoader, scriptsLoader, reticle, pointerLock) {
        var App = function() {
            var camera;
            var prevTime;
            var request;

            this.load = function(json) {
                scene.setScene(objectLoader.parse(json.scene));
                scene.setCSS3DScene(guiLoader.parse(json.gui));

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

                scriptsLoader.load(json.scripts, relevantApp);
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

            var animate = function(time) {
                request = requestAnimationFrame(animate);
                scriptsLoader.dispatchEvent(scriptsLoader.events.update, {time: time, delta: time - prevTime});
                fpControls.animate();
                reticle.loop();
                renderer.render(scene, camera);
                prevTime = time;
            };

            this.play = function() {
                scriptsLoader.addEventListeners();

                request = requestAnimationFrame(animate);
                prevTime = performance.now();
            };

            this.stop = function() {
                scriptsLoader.removeEventListeners();

                cancelAnimationFrame(request);
            };

            this.init = function() {
                var _this = this;

                var remoteLoader = new THREE.XHRLoader();
                remoteLoader.load('client/assets/scene.json', function(text) {
                    _this.load(JSON.parse(text));
                    _this.setSize(window.innerWidth, window.innerHeight);
                    _this.play();

                    fpControls.init();
                    playerSync.init();
                    reticle.init();
                    pointerLock.init();

                    container.appendChild(renderer.domElement);

                    window.addEventListener('resize', function() {
                        _this.setSize(window.innerWidth, window.innerHeight);
                    });
                });
            };
        };

        return new App();
    });
