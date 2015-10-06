'use strict';

define(['scripting/Manager', 'Constants', 'gui/Manager', 'html!Coding', 'i18n!nls/Coding'], function(scripts, constants, gui, html, i18n) {
    var rightClick = function(obj) {
        // FIXME this is hardcoded to only work with a specific panel
        var panel = 'B122616D-D2F4-4D4C-AC6C-899A7C03D473';

        var objScripts = scripts.getScripts(obj.uuid);
        var script;
        var scriptNames = objScripts ? Object.keys(objScripts) : [];

        switch (scriptNames.length) {
            case 0:
                console.warn('Objects has no scripts - only edition objects with exactly one script is supported'); // TODO handle
                return;
            case 1:
                script = {
                    name: scriptNames[0],
                    source: objScripts[scriptNames[0]]
                };
                break;
            default:
                console.warn('Objects has more than one script - only edition objects with exactly one script is supported'); // TODO handle
                return;
        }

        var codingHeader = html.getElementsByClassName(constants.coding.CODING_HEADER)[0];
        codingHeader.innerHTML = obj.name + ' | ' + script.name;

        var codeTextArea = html.getElementsByClassName(constants.coding.CODE_TEXTAREA)[0];
        codeTextArea.value = script.source;

        var updateButton = html.getElementsByClassName(constants.coding.UPDATE_BUTTON)[0];
        updateButton.innerHTML = i18n.update;
        updateButton.onclick = function() {
            scripts.loadScript({
                name: script.name,
                source: codeTextArea.value
            }, obj.uuid);
        };

        var cancelButton = html.getElementsByClassName(constants.coding.CLOSE_BUTTON)[0];
        cancelButton.innerHTML = i18n.cancel;
        cancelButton.onclick = function() {
            gui.cancel(panel);
        };

        gui.beam(html, panel);
    };

    return {
        rightClick: rightClick
    };
});
