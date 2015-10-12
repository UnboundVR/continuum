// TODO migrate html, i18n

var auth = require('../auth/Profile');

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(html);

    var profile = auth.getProfile();

    var profileImage = container.getElementsByClassName(consts.ui.profile.PROFILE_PICTURE)[0];
    profileImage.src = profile.picture;

    var name = container.getElementsByClassName(consts.ui.profile.USER_NAME)[0];
    name.innerHTML = profile.name;

    var mail = container.getElementsByClassName(consts.ui.profile.MAIL)[0];
    mail.innerHTML = profile.email;

    var role = container.getElementsByClassName(consts.ui.profile.ROLE)[0];
    role.className += ' ' + (profile.role || consts.auth.roles.USER);
    role.setAttribute('title', i18n.yourRoleIs + ' ' + i18n.roles[profile.role || consts.auth.roles.USER]);
};

module.exports = {
    init: init
};
