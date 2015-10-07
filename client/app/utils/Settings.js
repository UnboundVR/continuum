'use strict';

define(['auth/Profile', 'Events'], function(auth, events) {
    var get = function(setting) {
        var value = auth.getMetadataField(setting.name);

        if (value === undefined) {
            return setting.defaultValue;
        }

        return value;
    };

    var set = function(setting, value) {
        var payload = {};
        payload[setting.name] = value;
        return auth.changeUserMetadata(payload);
    };

    var onChange = function onChange(setting, callback) {
        events.subscribe(events.list.settingchanged, function(change) {
            if (change[setting.name] !== undefined) {
                callback(change[setting.name]);
            }
        });
    };

    return {
        get: get,
        set: set,
        onChange: onChange
    };
});
