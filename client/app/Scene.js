'use strict';

define([], function() {
    return {
        setScene: function(value) {
            this.scene = value;
        },

        getScene: function() {
            return this.scene;
        },

        getObjectByUUID: function(uuid) {
            return this.scene.getObjectByProperty('uuid', uuid, true);
        },

        setCSS3DScene: function(value) {
            this.css3DScene = value;
        },

        getCSS3DScene: function() {
            return this.css3DScene;
        }
    };
});
