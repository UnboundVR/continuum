'use strict';

define(['text!assets/html/Profile.html', 'text!assets/css/Profile.css', 'utils/BuildHTMLNode', 'i18n!nls/Profile', 'Auth'], function(html, css, buildHTMLNode, i18n, auth) {
    var init = function() {
        var container = document.getElementById(constants.ui.UI_CONTAINER);
        var element = buildHTMLNode(html, css);
        container.appendChild(element);

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
