var requests = require('./utils/Requests');
var consts = require('../../shared/Constants');

var baseUrl = consts.routes.api.BASE.substring(1);

var getScene = function(sceneId) {
    var url = baseUrl + consts.routes.api.SCENE;
    if (sceneId) {
        url += '/' + sceneId;
    }
    return requests.get(url);
};

module.exports = {
    getScene: getScene
};
