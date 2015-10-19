var world = require('./World');

var init = function() {
    var janus = new Janus({
        server: ['ws://unboundvr.com:8188/','http://unboundvr.com:8088/janus']
    });

    console.log(janus);
};

world.onInit(init);
