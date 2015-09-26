define(['World', 'PointerLock', 'Auth'], function(world, pointerLock, auth) {

    var domElement;
    var profile = auth.getProfile();

    var init = function() {
        domElement = document.getElementById('2dui');

        // TODO put in css file
        domElement.style.position = 'absolute';
        domElement.style.zIndex = 2;
        domElement.style.backgroundColor = 'black';
        domElement.style.textAlign = 'center';

        drawUI();

        pointerLock.onChange(function(locked) {
            if (!locked) {
                enableUI();
            } else {
                disableUI();
            }
        });
    };

    var drawUI = function() {
        // TODO take from HTML and CSS files brought via requirejs text plugin
        var profileImage = document.createElement('img');
        profileImage.src = profile.picture;
        profileImage.style.width = '128px';
        profileImage.style.height = '128px';
        domElement.appendChild(profileImage);

        var name = document.createElement('span');
        name.innerHTML = profile.name;
        name.style.display = 'block';
        name.style.color = 'white';
        domElement.appendChild(name);

        var designButton = document.createElement('button');
        designButton.innerHTML = 'I love this design';
        domElement.appendChild(designButton);
        designButton.onclick = function() {
            alert('You are lying.');
        };

        var logoutButton = document.createElement('button');
        logoutButton.innerHTML = 'Logout';
        domElement.appendChild(logoutButton);
        logoutButton.onclick = auth.logout;
    };

    var enableUI = function() {
        domElement.style.display = '';
    };

    var disableUI = function() {
        domElement.style.display = 'none';
    };

    world.onInit(init);

    return {

    };
});
