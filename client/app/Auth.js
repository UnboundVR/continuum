'use strict';

define(['Three'], function(THREE) {
    
    var getToken = function() {
        return localStorage.getItem('id_token');
    };
    
    return {
        getToken: getToken
    };
});
