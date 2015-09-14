'use strict';

define(['Three', 'FirstPersonControls', 'Renderer', 'ObjectLoader', 'Container', 'Scene', 'Network', 'VRMode', 'loaders/GUILoader'],
    function(THREE, fpControls, renderer, objectLoader, container, scene, network, vrMode, guiLoader) {
        var App = function() {
            var camera;
			var prevTime;
            var request;

            var events = {
                keydown: {list: [], isBrowserEvent: true},
                keyup: {list: [], isBrowserEvent: true},
                mousedown: {list: [], isBrowserEvent: true},
                mouseup: {list: [], isBrowserEvent: true},
                mousemove: {list: [], isBrowserEvent: true},
                touchstart: {list: [], isBrowserEvent: true},
                touchend: {list: [], isBrowserEvent: true},
                touchmove: {list: [], isBrowserEvent: true},
                update: {list: []}
            };
			
			var browserEvents = Object.keys(events).filter(function(key) {
				return events[key].isBrowserEvent;
			});

            this.load = function(json) {
				scene.setScene(objectLoader.parse(json.scene));
                scene.setCSS3DScene(guiLoader.parse(json.gui));
                
				this.setCamera(fpControls.camera);
                this.loadScripts(json.scripts);
            };

            this.loadScripts = function(jsonScripts) {
                for (var uuid in jsonScripts) {
                    var object = scene.getScene().getObjectByProperty('uuid', uuid, true);
                    var scripts = jsonScripts[uuid];

                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
						
						var params = 'player, scene, ' + Object.keys(events).join(', ');
						var source = script.source + '\nreturn {' + Object.keys(events).map(function(key) {
							return key + ': ' + key;
						}).join(', ') + '};';
                        var functions = (new Function(params, source).bind(object))(this, scene.getScene());
						
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

            var animate = function(time) {
                request = requestAnimationFrame(animate);
                dispatch(events.update.list, {time: time, delta: time - prevTime});
                fpControls.animate();
                renderer.render(scene, camera);
                prevTime = time;
            };

            this.play = function() {
				for(var i = 0; i < browserEvents.length; i++) {
					var key = browserEvents[i];
					var callback = function(event) {
						dispatch(events[key].list, event);
					};
					events[key].callback = callback;
					document.addEventListener(key, callback);
				}

                request = requestAnimationFrame(animate);
                prevTime = performance.now();
            };

            this.stop = function() {
				for(var i = 0; i < browserEvents.length; i++) {
					var key = browserEvents[i];				
					document.removeEventListener(key, events[key].callback);
				}

                cancelAnimationFrame(request);
            };

            this.init = function() {
                var _this = this;

                var remoteLoader = new THREE.XHRLoader();
                remoteLoader.load('client/scene.json', function(text) {
                    _this.load(JSON.parse(text));
                    _this.setSize(window.innerWidth, window.innerHeight);
                    _this.play();
					
					fpControls.init();
					network.init();

                    container.appendChild(renderer.domElement);

                    window.addEventListener('resize', function() {
                        _this.setSize(window.innerWidth, window.innerHeight);
                    });
                });
            };
        };

        return new App();
    });
