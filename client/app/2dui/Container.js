var consts = require('../../../shared/constants');
var events = require('../Events');
var world = require('../World');
var pointerLock = require('../PointerLock');
var settings = require('../utils/Settings');

var helpUI = require('./Help');
var developerUI = require('./Developer');
var profileUI = require('./Profile');
var actionsUI = require('./Actions');
var settingsUI = require('./Settings');

var container;

var init = function() {
    container = document.getElementById(consts.ui.UI_CONTAINER);
    initChildren(profileUI, helpUI, actionsUI, settingsUI, developerUI);

    events.subscribe(consts.events.POINTER_LOCK_CHANGE, function(locked) {
        if (!locked) {
            enableUI();
        } else {
            disableUI();
        }
    });
};

var initChildren = function() {
    [].slice.call(arguments).forEach(function(child) {
        child.init();
    });
};

var enableUI = function() {
    container.style.display = 'block';
};

var disableUI = function() {
    container.style.display = 'none';
    events.dispatch(consts.events.SHOW_HELP, false);
    events.dispatch(consts.events.SHOW_SETTINGS, false);
};

var addElement = function(element) {
    container.appendChild(element);
};

world.onInit(init);

module.exports = {
    addElement: addElement
};
