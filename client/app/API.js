'use strict';

define(['utils/Requests', 'Constants'], function(req, constants) {
    var baseUrl = constants.routes.api.BASE.substring(1);

    var getScene = function(sceneId) {
        var url = baseUrl + constants.routes.api.SCENE;
        if (sceneId) {
            url += '/' + sceneId;
        }

        return req.get(url);
    };

    return {
        getScene: getScene
    };
});
