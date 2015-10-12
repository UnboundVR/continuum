var i18n = require('../translations/Polyglot');
var auth = require('../auth/Profile');
var consts = require('../../../shared/constants');

var buildHTMLNode = require('../utils/BuildHTMLNode');
var html = require('../../../assets/html/Profile.html')
var css = require('../../../assets/css/Profile.css');
var htmlNode = buildHTMLNode(html, css);

var init = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    container.appendChild(htmlNode);

    var profile = auth.getProfile();
    var profileImage = htmlNode.getElementsByClassName(consts.ui.profile.PROFILE_PICTURE)[0];
    profileImage.src = profile.picture;

    var name = htmlNode.getElementsByClassName(consts.ui.profile.USER_NAME)[0];
    name.innerHTML = profile.name;

    var mail = htmlNode.getElementsByClassName(consts.ui.profile.MAIL)[0];
    mail.innerHTML = profile.email;

    var role = htmlNode.getElementsByClassName(consts.ui.profile.ROLE)[0];
    role.className += ' ' + (profile.role || consts.auth.roles.USER);
    role.setAttribute('title', i18n.t('profile.yourRoleIs', {
        role: i18n.t('roles.' + (profile.role || consts.auth.roles.USER))
    }));
};

module.exports = {
    init: init
};
