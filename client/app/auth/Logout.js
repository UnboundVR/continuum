

define(['Constants'], function(constants) {
    return function() {
        localStorage.removeItem(constants.auth.ID_TOKEN);
        window.location.href = constants.routes.LOGIN_SCREEN;
    };
});
