define(['Three'], function(THREE) {
    var scene = null;

    return {
        setScene: function(value) {
            scene = value;
        },

        getScene: function() {
            return scene;
        },
    };
});
