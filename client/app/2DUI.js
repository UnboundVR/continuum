'use strict';

define(['World', 'PointerLock', 'Auth', 'Constants', 'utils/BuildHTMLNode', 'text!assets/html/2DUI.html', 'text!assets/css/2DUI.css', 'i18n!nls/2DUI'], function(world, pointerLock, auth, constants, buildHTMLNode, html, css, i18n) {

    var profile;
    var container;

    var init = function() {
        profile = auth.getProfile();

        initUI();
        hookUI();

        pointerLock.onChange(function(locked) {
            if (!locked) {
                enableUI();
            } else {
                disableUI();
            }
        });
    };

    var initUI = function() {
        container = document.getElementById(constants.ui.UI_CONTAINER);
        var element = buildHTMLNode(html, css);
        container.appendChild(element);
    };

    var hookUI = function() {
        var profileImage = container.getElementsByClassName(constants.ui.PROFILE_PICTURE)[0];
        profileImage.src = profile.picture;

        var name = container.getElementsByClassName(constants.ui.USER_NAME)[0];
        name.innerHTML = profile.name;

        var mail = container.getElementsByClassName(constants.ui.MAIL)[0];
        mail.innerHTML = profile.email;

        var role = container.getElementsByClassName(constants.ui.ROLE)[0];
        role.className += ' ' + (profile.role || constants.auth.roles.USER);
        role.setAttribute('title', i18n.yourRoleIs + ' ' + i18n.roles[profile.role || constants.auth.roles.USER]);

        var designButton = container.getElementsByClassName(constants.ui.LOVE_BUTTON)[0];
        designButton.setAttribute('title', i18n.love);
        designButton.onclick = function() {
            //TODO: Log that user likes demo.
        };

        var logoutButton = container.getElementsByClassName(constants.ui.LOGOUT_BUTTON)[0];
        logoutButton.setAttribute('title', i18n.logout);
        logoutButton.onclick = auth.logout;
    };

    var enableUI = function() {
        container.style.display = '';
    };

    var disableUI = function() {
        container.style.display = constants.html.DISPLAY_NONE;
    };

    var addElement = function(element) {
        container.appendChild(element);
    };

    world.onInit(init);

    return {
        addElement: addElement
    };
});
