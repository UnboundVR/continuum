

define([], function() {
    return function(html, css) {
        var htmlNode = document.createElement(consts.html.DIV);
        htmlNode.innerHTML = html;

        if (css) {
            var cssNode = document.createElement(consts.html.STYLE);
            cssNode.innerHTML = css;
            htmlNode.appendChild(cssNode);
        }

        return htmlNode;
    };
});
