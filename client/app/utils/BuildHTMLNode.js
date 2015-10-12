

define([], function() {
    return function(html, css) {
        var htmlNode = document.createElement(constants.html.DIV);
        htmlNode.innerHTML = html;

        if (css) {
            var cssNode = document.createElement(constants.html.STYLE);
            cssNode.innerHTML = css;
            htmlNode.appendChild(cssNode);
        }

        return htmlNode;
    };
});
