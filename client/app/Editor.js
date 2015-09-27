'use strict';

define(['ScriptsManager', 'Constants'], function(scripts, constants) {
    var used = false;

    var rightClick = function(obj) {
        // FIXME for now this is hardcoded to only work with the cube, and only change once
        if (obj.name !== 'DevCube' || used) {
            return;
        }

        // FIXME this is hardcoded to only work with 'coderCube' script for now...
        var scriptName = 'coderCube';

        document.getElementById('coding').style.display = constants.html.DISPLAY_BLOCK;
        document.getElementById('codingHeader').innerHTML = 'Now we\'re talking. I mean, coding.';
        document.getElementById('codingHelp').style.display = constants.html.DISPLAY_BLOCK;
        document.getElementById('leCode').value = scripts.getScript(obj.uuid, scriptName);
        document.getElementById('doCode').onclick = function() {
            scripts.loadScript({
                name: scriptName,
                source: document.getElementById('leCode').value},
                obj.uuid
            );
        };

        used = true;
    };

    return {
        rightClick: rightClick
    };
});
