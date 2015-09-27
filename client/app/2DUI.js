'use strict';

define(['World', 'PointerLock', 'Auth', 'Constants', 'text!assets/html/2DUI.html', 'text!assets/css/2DUI.css', 'i18n!nls/2DUI'], function(world, pointerLock, auth, constants, html, css, i18n) {

    var profile = auth.getProfile();
    var container;

    var init = function() {
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
        var element = document.createElement(constants.html.DIV);
        element.innerHTML = html;
        container.appendChild(element);
        var style = document.createElement(constants.html.STYLE);
        style.innerHTML = css;
        document.body.appendChild(style);
    };

    var hookUI = function() {
        var profileImage = document.getElementById(constants.ui.PROFILE_PICTURE);
        profileImage.src = profile.picture;

        var name = document.getElementById(constants.ui.USER_NAME);
        name.innerHTML = profile.name;

        var mail = document.getElementById(constants.ui.MAIL);
        mail.innerHTML = profile.email;

        // TODO remove once design is decent :P
        var designButton = document.getElementById('designButton');
        designButton.onclick = function() {
            alert('You are lying, ' + auth.getVocative() + '.');
        };

        var logoutButton = document.getElementById(constants.ui.LOGOUT_BUTTON);
        logoutButton.innerHTML = i18n.logout;
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
