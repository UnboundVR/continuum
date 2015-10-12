var consts = require('../../../shared/constants');
var events = require('../Events');
var world = require('../World');
var pointerLock = require('../PointerLock');

var help = require('./Help');
var developer = require('./Developer');
var profile = require('./Profile');
var actions = require('./Actions');
var settings = require('./Settings');

var container;

var init = function() {
    container = document.getElementById(consts.ui.UI_CONTAINER);
    initChildren(profile, help, developer, actions, settings);

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
    container.style.display = '';
};

var disableUI = function() {
    container.style.display = consts.html.DISPLAY_NONE;
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
