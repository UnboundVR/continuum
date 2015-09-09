define(['Three', 'FirstPersonControls', 'Renderer', 'ObjectLoader', 'Container', 'Scene', 'Network', 'VRMode'],
    function(THREE, fpControls, renderer, objectLoader, container, scene, network, vrMode) {
        var App = function() {
            var camera;

            var events = {
                keydown: [],
                keyup: [],
                mousedown: [],
                mouseup: [],
                mousemove: [],
                touchstart: [],
                touchend: [],
                touchmove: [],
                update: [],
            };

            this.dom = undefined;

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.load = function(json) {
                this.dom = renderer.domElement;
                scene.setScene(objectLoader.parse(json.scene));
                this.setCamera(fpControls.camera);
                this.loadScripts(json.scripts);
            };

            this.loadScripts = function(jsonScripts) {
                for (var uuid in jsonScripts) {
                    var object = scene.getScene().getObjectByProperty('uuid', uuid, true);
                    var scripts = jsonScripts[uuid];

                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        var functions = (new Function('player, scene, keydown, keyup, mousedown, mouseup, mousemove, touchstart, touchend, touchmove, update', script.source + '\nreturn { keydown: keydown, keyup: keyup, mousedown: mousedown, mouseup: mouseup, mousemove: mousemove, touchstart: touchstart, touchend: touchend, touchmove: touchmove, update: update };').bind(object))(this, scene.getScene());

                        for (var name in functions) {
                            if (functions[name] === undefined) continue;
                            if (events[name] === undefined) {
                                console.warn('APP.Player: event type not supported (', name, ')');
                                continue;
                            }

                            events[name].push(functions[name].bind(object));
                        }
                    }
                }
            };

            this.setCamera = function(value) {
                camera = value;
                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();
            };

            this.setSize = function(width, height) {
                if (renderer._fullScreen) {
                    return;
                }

                this.width = width;
                this.height = height;

                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            };

            var dispatch = function(array, event) {
                for (var i = 0, l = array.length; i < l; i++) {
                    array[i](event);
                }
            };

            var prevTime;
            var request;

            var animate = function(time) {
                request = requestAnimationFrame(animate);

                dispatch(events.update, {time: time, delta: time - prevTime});

                fpControls.animate();

                renderer.render(scene.getScene(), camera);

                prevTime = time;
            };

            this.play = function() {
                document.addEventListener('keydown', onDocumentKeyDown);
                document.addEventListener('keyup', onDocumentKeyUp);
                document.addEventListener('mousedown', onDocumentMouseDown);
                document.addEventListener('mouseup', onDocumentMouseUp);
                document.addEventListener('mousemove', onDocumentMouseMove);
                document.addEventListener('touchstart', onDocumentTouchStart);
                document.addEventListener('touchend', onDocumentTouchEnd);
                document.addEventListener('touchmove', onDocumentTouchMove);

                request = requestAnimationFrame(animate);
                prevTime = performance.now();

                fpControls.init();
                network.init();
            };

            this.stop = function() {
                document.removeEventListener('keydown', onDocumentKeyDown);
                document.removeEventListener('keyup', onDocumentKeyUp);
                document.removeEventListener('mousedown', onDocumentMouseDown);
                document.removeEventListener('mouseup', onDocumentMouseUp);
                document.removeEventListener('mousemove', onDocumentMouseMove);
                document.removeEventListener('touchstart', onDocumentTouchStart);
                document.removeEventListener('touchend', onDocumentTouchEnd);
                document.removeEventListener('touchmove', onDocumentTouchMove);

                cancelAnimationFrame(request);
            };

            var onDocumentKeyDown = function(event) {
                dispatch(events.keydown, event);
            };

            var onDocumentKeyUp = function(event) {
                dispatch(events.keyup, event);
            };

            var onDocumentMouseDown = function(event) {
                dispatch(events.mousedown, event);
            };

            var onDocumentMouseUp = function(event) {
                dispatch(events.mouseup, event);
            };

            var onDocumentMouseMove = function(event) {
                dispatch(events.mousemove, event);
            };

            var onDocumentTouchStart = function(event) {
                dispatch(events.touchstart, event);
            };

            var onDocumentTouchEnd = function(event) {
                dispatch(events.touchend, event);
            };

            var onDocumentTouchMove = function(event) {
                dispatch(events.touchmove, event);
            };

            this.init = function() {
                var _this = this;

                var remoteLoader = new THREE.XHRLoader();
                remoteLoader.load('client/scene.json', function(text) {
                    _this.load(JSON.parse(text));
                    _this.setSize(window.innerWidth, window.innerHeight);
                    _this.play();

                    container.appendChild(_this.dom);

                    window.addEventListener('resize', function() {
                        _this.setSize(window.innerWidth, window.innerHeight);
                    });
                });
            };
        };

        return new App();
    });
