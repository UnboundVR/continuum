var consts = require('../../../shared/constants');

module.exports = function(html, css) {
    var htmlNode = document.createElement('div');
    htmlNode.innerHTML = html;

    if (css) {
        var cssNode = document.createElement('style');
        cssNode.innerHTML = css;
        htmlNode.appendChild(cssNode);
    }

    return htmlNode;
};
