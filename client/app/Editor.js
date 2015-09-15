'use strict';

define([], function() {
	var rightClick = function(obj) {
        console.log('editing ' + obj.name)
    };
	
    return {
        rightClick: rightClick
	};
});
