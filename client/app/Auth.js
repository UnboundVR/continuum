'use strict';

define([], function() {
    
    var getToken = function() {
        return localStorage.getItem('id_token');
    };
    
    return {
        getToken: getToken
    };
});
