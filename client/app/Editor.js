var consts = require('../../shared/constants');
var scripts = require('./scripting/Manager');
var gui = require('./gui/Manager');
var i18n = require('./translations/I18n');

var buildHTMLNode = require('./utils/BuildHTMLNode');
var html = require('../../assets/html/Coding.html');
var css = require('../../assets/css/Coding.css');
var htmlNode = buildHTMLNode(html, css);

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

    var codingHeader = htmlNode.getElementsByClassName(consts.coding.CODING_HEADER)[0];
    codingHeader.innerHTML = obj.name + ' | ' + script.name;

    var codeTextArea = htmlNode.getElementsByClassName(consts.coding.CODE_TEXTAREA)[0];
    codeTextArea.value = script.source;

    var updateButton = htmlNode.getElementsByClassName(consts.coding.UPDATE_BUTTON)[0];
    updateButton.innerHTML = i18n.t('update');
    updateButton.onclick = function() {
        scripts.loadScript({
            name: script.name,
            source: codeTextArea.value
        }, obj.uuid);
    };

    var cancelButton = htmlNode.getElementsByClassName(consts.coding.CLOSE_BUTTON)[0];
    cancelButton.innerHTML = i18n.t('cancel');
    cancelButton.onclick = function() {
        gui.cancel(panel);
    };

    gui.beam(htmlNode, panel);
};

module.exports = {
    rightClick: rightClick
};
