var consts = require('./constants');

var getRole = function(profile) {
    return profile.role || consts.auth.roles.USER;
};

var isAdmin = function(profile) {
    return getRole(profile) === consts.auth.roles.ADMIN;
};

var getSetting = function(profile, setting) {
    var value = getMetadataField(profile, setting.name);

    if(value === undefined) {
        return setting.defaultValue;
    }

    return value;
};

var getMetadataField = function(profile, field) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

    if (profile.user_metadata && profile.user_metadata[field] !== undefined) {
        return profile.user_metadata[field];
    };

    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
};

module.exports = {
    isAdmin: isAdmin,
    getRole: getRole,
    getMetadataField: getMetadataField,
    getSetting: getSetting
};
