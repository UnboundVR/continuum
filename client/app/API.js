'use strict';

define(['utils/Requests', 'Constants', 'Auth'], function(req, constants, auth) {
    var baseUrl = constants.routes.api.BASE.substring(1);
    var auth0Base = 'https://' + constants.auth.AUTH0_DOMAIN + constants.auth.AUTH0_API;

    var getScene = function(sceneId) {
        var url = baseUrl + constants.routes.api.SCENE;
        if (sceneId) {
            url += '/' + sceneId;
        }

        return req.get(url);
    };

    var changeUserMetadata = function(metadata) {
        var url = auth0Base + constants.auth.AUTH0_USERS + '/' + auth.getProfile().user_id;
        var payload = {
            user_metadata: metadata
        };
        
        return req.patch(url, payload);
    };

    return {
        getScene: getScene,
        changeUserMetadata: changeUserMetadata
    };
});
