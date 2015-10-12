var auth = require('../auth/Profile');
var events = require('../Events');
var consts = require('../../../shared/constants');

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
    events.subscribe(consts.events.SETTING_CHANGED, function(change) {
        if (change[setting.name] !== undefined) {
            callback(change[setting.name]);
        }
    });
};

module.exports = {
    get: get,
    set: set,
    onChange: onChange
};
