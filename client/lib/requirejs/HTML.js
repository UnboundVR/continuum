define({
    load: function (name, req, onload, config) {
        req(['text!assets/html/' + name + '.html', 'text!assets/css/' + name + '.css', 'utils/BuildHTMLNode'], function (html, css, buildHTMLNode) {
            onload(buildHTMLNode(html, css));
        });
    }
});
