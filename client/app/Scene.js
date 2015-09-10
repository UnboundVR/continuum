define(['Three'], function(THREE) {
    return {
        setScene: function(value) {
            this.scene = value;
        },

        getScene: function() {
            return this.scene;
        },
		
		setCSS3DScene: function(value) {
			this.css3DScene = value
		},
		
		getCSS3DScene: function() {
			return this.css3DScene;
		}
    };
});
