var consts = require('../../../shared/constants');
var req = require('../utils/Requests');
var events = require('../Events');
var logout = require('../auth/Logout');
var utils = require('../../../shared/profileUtils');

var profile;
var auth0Base = 'https://' + consts.auth.AUTH0_DOMAIN + consts.auth.AUTH0_API;

var changeUserMetadata = function(metadata) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

    var url = auth0Base + consts.auth.AUTH0_USERS + '/' + profile.user_id;
    var payload = {
        user_metadata: metadata
    };

    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    return req.patch(url, payload).then(function(response) {
        profile = response;
        events.dispatch(consts.events.SETTING_CHANGED, metadata);
    }, logout);
};

var getProfile = function() {
    return profile;
};

var setProfile = function(val) {
    profile = val;
};

var getRole = function() {
    return utils.getRole(profile);
};

var isAdmin = function() {
    return utils.isAdmin(profile);
};

module.exports = {
    setProfile: setProfile,
    getProfile: getProfile,
    getRole: getRole,
    isAdmin: isAdmin,
    changeUserMetadata: changeUserMetadata
};
