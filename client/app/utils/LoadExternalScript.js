// based on http://stackoverflow.com/questions/7718935/load-scripts-asynchronously
module.exports = function(src) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        var ready = false;

        script.type = 'text/javascript';
        script.src = src;
        script.onload = script.onreadystatechange = function() {
            // console.log( this.readyState ); //uncomment this line to see which ready states are called.
            if (!ready && (!this.readyState || this.readyState == 'complete')) {
                ready = true;
                resolve();
            }
        };

        var tag = document.getElementsByTagName('script')[0];
        tag.parentNode.insertBefore(script, tag);
    });
};
