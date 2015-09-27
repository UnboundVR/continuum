define(['World', 'PointerLock', 'Auth', 'Text!assets/html/2DUI.html', 'Text!assets/css/2DUI.css'], function(world, pointerLock, auth, html, css) {

    var profile = auth.getProfile();

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
        container = document.getElementById('ui-container');
        var element = document.createElement('div');
        element.innerHTML = html;
        container.appendChild(element);
        var style = document.createElement('style');
        style.innerHTML = css;
        document.body.appendChild(style);
    };

    var hookUI = function() {
        var profileImage = document.getElementById('profilePicture');
        profileImage.src = profile.picture;

        var name = document.getElementById('userName');
        name.innerHTML = profile.name;

        var mail = document.getElementById('mail');
        mail.innerHTML = profile.email;

        var designButton = document.getElementById('designButton');
        designButton.onclick = function() {
            alert('You are lying, ' + auth.getVocative() + '.');
        };

        var logoutButton = document.getElementById('logoutButton');
        logoutButton.onclick = auth.logout;
    };

    var enableUI = function() {
        container.style.display = '';
    };

    var disableUI = function() {
        container.style.display = 'none';
    };

    var addElement = function(element) {
        container.appendChild(element);
    };

    world.onInit(init);

    return {
        addElement: addElement
    };
});
