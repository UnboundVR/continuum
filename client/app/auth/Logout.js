var consts = require('../../../shared/constants');

module.exports = function() {
    localStorage.removeItem(consts.auth.ID_TOKEN);
    window.location.href = constants.routes.CONTINUUM_SITE;
};
