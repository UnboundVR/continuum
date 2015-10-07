'use strict';

define(['Constants', 'i18n!nls/Auth', 'utils/Requests', 'Events'], function(constants, i18n, req, events) {

    var profile;
    var auth0Base = 'https://' + constants.auth.AUTH0_DOMAIN + constants.auth.AUTH0_API;

    var changeUserMetadata = function(metadata) {
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var url = auth0Base + constants.auth.AUTH0_USERS + '/' + profile.user_id;
        var payload = {
            user_metadata: metadata
        };

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        return req.patch(url, payload).then(function(response) {
            profile = response;
            events.dispatch(constants.events.SETTING_CHANGED, metadata);
        }, logout);
    };

    var getProfile = function() {
        return profile;
    };

    var setProfile = function(val) {
        profile = val;
    };

    var getVocative = function() {
        var vocative = i18n.vocatives.human;
        if (profile.gender === constants.auth.GENDER_MALE) {
            vocative = i18n.vocatives.gentleman;
        } else if (profile.gender === constants.auth.GENDER_FEMALE) {
            vocative = i18n.vocatives.lady;
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

    return {
        setProfile: setProfile,
        getProfile: getProfile,
        getVocative: getVocative,
        changeUserMetadata: changeUserMetadata,
        getMetadataField: getMetadataField
    };
});
