var profile = require('../auth/Profile');
var events = require('../Events');
var consts = require('../../../shared/constants');
var profileUtils = require('../../../shared/profileUtils');

var get = function(setting) {
    return profileUtils.getSetting(profile.getProfile(), setting);
};

var set = function(setting, value) {
    var payload = {};
    payload[setting.name] = value;
    return profile.changeUserMetadata(payload);
};

var onChange = function(setting, callback) {
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
