var consts = require('../../../shared/constants');
var events = require('../Events');
var settings = require('../utils/Settings');
var world = require('../World');

var buildHTMLNode = require('../utils/BuildHTMLNode');
var html = require('../../../assets/html/Developer.html');
var css = require('../../../assets/css/Developer.css');
var htmlNode = buildHTMLNode(html, css);

var coords;
var position;

var show = function() {
    htmlNode.style.display = 'block';
};

var hide = function() {
    htmlNode.style.display = 'none';
};

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(htmlNode);

    coords = htmlNode.getElementsByClassName(consts.ui.coords.COORDS_TEXT)[0];

    events.subscribe(consts.events.PLAYER_MOVED, updateCoords);
    world.onLoop(displayUpdatedCoords, 1000);

    if (!settings.get(consts.settings.IS_DEVELOPER)) {
        hide();
    }

    settings.onChange(consts.settings.IS_DEVELOPER, function(display) {
        (display ? show : hide)();
    });
};

var roundCoord = function(coord) {
    return parseFloat(Math.round(coord * 100) / 100).toFixed(3);
};

var updateCoords = function(val) {
    position = val;
};

var displayUpdatedCoords = function() {
    if (position) {
        coords.innerHTML = 'X: ' +  roundCoord(position.x) + '<br/> Y: ' + roundCoord(position.y) + '<br/> Z: ' + roundCoord(position.z);
    }
};

module.exports = {
    init: init
};
