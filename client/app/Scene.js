'use strict';

define(['Constants'], function(constants) {
    return {
        setScene: function(value) {
            this.scene = value;
        },

        getScene: function() {
            return this.scene;
        },

        getObjectByUUID: function(uuid) {
            return this.scene.getObjectByProperty(constants.properties.UUID, uuid, true);
        },

        setCSS3DScene: function(value) {
            this.css3DScene = value;
        },

        getCSS3DScene: function() {
            return this.css3DScene;
        }
    };
});
