var consts = require('../../../shared/constants');
var req = require('../utils/Requests');
var events = require('../Events');
var i18n = require('../translations/Polyglot');
var logout = require('../auth/Logout');

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

var getVocative = function() {
    var vocative = i18n.t('vocatives.human');
    if (profile.gender === consts.auth.GENDER_MALE) {
        vocative = i18n.t('vocatives.gentleman');
    } else if (profile.gender === consts.auth.GENDER_FEMALE) {
        vocative = i18n.t('vocatives.lady');
    }

    return vocative;
};

var getMetadataField = function(field) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

    if (profile.user_metadata && profile.user_metadata[field] !== undefined) {
        return profile.user_metadata[field];
    };

    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
};

module.exports = {
    setProfile: setProfile,
    getProfile: getProfile,
    getVocative: getVocative,
    changeUserMetadata: changeUserMetadata,
    getMetadataField: getMetadataField
};
