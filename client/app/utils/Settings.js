'use strict';

define(['auth/Profile'], function(auth, api) {
    var get = function(setting) {
        var value = auth.getMetadataField(setting.name);

        if(value === undefined) {
            return setting.defaultValue;
        }

        return value;
    };

    var set = function(setting, value) {
        var payload = {};
        payload[setting.name] = value;
        return auth.changeUserMetadata(payload);
    };

    return {
        get: get,
        set: set
    };
});
