var i18n = require('../translations/I18n');
var profile = require('./Profile').getProfile();

var getVocative = function() {
    var vocative = i18n.t('vocatives.human');
    if (profile.gender === consts.auth.GENDER_MALE) {
        vocative = i18n.t('vocatives.gentleman');
    } else if (profile.gender === consts.auth.GENDER_FEMALE) {
        vocative = i18n.t('vocatives.lady');
    }

    return vocative;
};

module.exports = getVocative;
