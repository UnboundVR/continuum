'use strict';

define(['ScriptsManager', 'Constants', 'GUIManager', 'text!assets/html/Coding.html', 'text!assets/css/Coding.css'], function(scripts, constants, gui, html, css) {
    var rightClick = function(obj) {
        // FIXME this is hardcoded to only work with 'coderCube' script and a specific panel
        var scriptName = 'coderCube';
        var panel = 'B122616D-D2F4-4D4C-AC6C-899A7C03D473';
        var script = scripts.getScript(obj.uuid, scriptName);

        var codingHtml = document.createElement('div');
        codingHtml.innerHTML = html;

        var codeTextArea = codingHtml.getElementsByClassName('leCode')[0];
        codeTextArea.value = script;

        var codeButton = codingHtml.getElementsByClassName('update')[0];
        codeButton.onclick = function() {
            scripts.loadScript({
                name: scriptName,
                source: codeTextArea.value
            }, obj.uuid);
        };

        gui.beam(codingHtml, panel);
    };

    return {
        rightClick: rightClick
    };
});
