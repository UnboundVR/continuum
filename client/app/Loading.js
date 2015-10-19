var consts = require('../../shared/constants');

var hide = function() {
    var container = document.getElementById(consts.ui.UI_CONTAINER);
    var loadingSpinner = container.getElementsByClassName(consts.ui.LOADING_SPINNER)[0];
    loadingSpinner.style.display = 'none';
};

module.exports = {
    hide: hide
};
