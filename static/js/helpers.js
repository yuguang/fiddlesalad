function slugify(text) {
    text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
    text = text.replace(/-/gi, "_");
    text = text.replace(/\s/gi, "-");
    return text.toLowerCase();
}

function popup(url) {
    newWindow = window.open(url, 'name', 'height=500,width=400');
    if (window.focus) {
        newWindow.focus()
    }
    return false;
}

function prefetchImport(script) {
    var code = script || engine.get_code();
    // if the keword import is not used, return
    if (_.indexOf(code.split(' '), 'import') == -1) return;
    // for each line that imports a module, execute it
    _(code.split('\n')).chain()
        .map(function (line) {
                // replaces "import ", "from ", and " import *"
                return line.replace(/import\s*|from\s|\simport\s\*/, '');
        })
        .select(function (module) {
                return module in files;
        })
        .each(function (module) {
                $.get(files[module], function(data) {
                        prefetchImport(data);
                });
                delete files[module];
        });
}

function getDocumentHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function getDocumentWidth() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
        Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
        Math.max(D.body.clientWidth, D.documentElement.clientWidth)
    );
}

var keywordDict = _.memoize(function(keywords) {
    var dict = new Object;
    _.each(keywords, function(keyword) {
        if (keyword.indexOf('.') >= 0) {
            return dict[keyword.split('.')[1]] = keyword;
        } else {
            return dict[keyword] = keyword;
        }
    });
    return dict;
});

String.prototype.count=function(s1) {
    return this.length - this.replace(new RegExp(s1,"g"), '').length;
}

var switchTo5x = false;

var defaultEditor = {
    lineNumbers: false,
    indentUnit: 4,
    tabMode: "shift",
    matchBrackets: true
};

var worker_url = debug ? '/static/js/' : 'http://' + window.location.hostname + '/js/';

MINUTE = 60000;

WORD_TOKEN = /^[\w$_.@]+$/;
