'use strict';

define(['html!Profile', 'i18n!nls/Profile', 'auth/Profile'], function(html, i18n, auth) {
    var init = function() {
        var container = document.getElementById(constants.ui.UI_CONTAINER);
        container.appendChild(html);

        var profile = auth.getProfile();

        var profileImage = container.getElementsByClassName(constants.ui.profile.PROFILE_PICTURE)[0];
        profileImage.src = profile.picture;

        var name = container.getElementsByClassName(constants.ui.profile.USER_NAME)[0];
        name.innerHTML = profile.name;

        var mail = container.getElementsByClassName(constants.ui.profile.MAIL)[0];
        mail.innerHTML = profile.email;

        var role = container.getElementsByClassName(constants.ui.profile.ROLE)[0];
        role.className += ' ' + (profile.role || constants.auth.roles.USER);
        role.setAttribute('title', i18n.yourRoleIs + ' ' + i18n.roles[profile.role || constants.auth.roles.USER]);
    };

    return {
        init: init
    };
});
