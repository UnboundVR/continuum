var fs = require('fs');

module.exports = function() {
    require.extensions['.cer'] = function(module, filename) {
        module.exports = fs.readFileSync(filename, 'utf8');
    };
};
