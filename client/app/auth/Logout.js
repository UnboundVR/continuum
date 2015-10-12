var consts = require('../../../shared/Constants');

module.exports = function() {
    localStorage.removeItem(consts.auth.ID_TOKEN);
    window.location.href = consts.routes.LOGIN_SCREEN;
};
