(function () {

    function scriptHint(editor, _keywords, getToken, lastChar) {
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
        if (/\b(?:string|comment)\b/.test(token.type)) return;
        // If it's not a 'word-style' token, ignore the token.

        var completionList = [];
        if (!/^[\w$_]*$/.test(token.string)) {
            token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                className: token.string == ":" ? "python-type" : null};
        }
        if (!context) var context = [];
        context.push(tprop);

        if (!token.string.length) { //first letter of the line
            completionList = this.wordAutoComplete.getCompletions(lastChar);
        } else {
            completionList = this.wordAutoComplete.getCompletions(token.string);
            if (completionList.length === 1 && token.string === completionList[0]) {
                completionList = [];
            }
        }

        //prevent autocomplete for last word, instead show dropdown with one word
        if (completionList.length == 1) {
            completionList.push(" ");
        }

        return {list: completionList,
            from: CodeMirror.Pos(cur.line, token.start),
            to: CodeMirror.Pos(cur.line, token.end)};
    }

    CodeMirror.pythonHint = function (editor, lastChar) {
        return _.bind(scriptHint, this, editor, pythonKeywordsU, function (e, cur) {
            return e.getTokenAt(cur);
        }, lastChar)();
    };

    var pythonKeywords = "and del from not while as elif global or with assert else if pass yield"
        + "break except import print class exec in raise continue finally is return def for lambda try";
    var pythonKeywordsL = pythonKeywords.split(" ");
    var pythonKeywordsU = pythonKeywords.toUpperCase().split(" ");

    var pythonBuiltins = "abs divmod input open staticmethod all enumerate int ord str "
        + "any eval isinstance pow sum basestring execfile issubclass print super"
        + "bin file iter property tuple bool filter len range type"
        + "bytearray float list raw_input unichr callable format locals reduce unicode"
        + "chr frozenset long reload vars classmethod getattr map repr xrange"
        + "cmp globals max reversed zip compile hasattr memoryview round __import__"
        + "complex hash min set apply delattr help next setattr buffer"
        + "dict hex object slice coerce dir id oct sorted intern ";
    var pythonBuiltinsL = pythonBuiltins.split(" ").join("() ").split(" ");
    var pythonBuiltinsU = pythonBuiltins.toUpperCase().split(" ").join("() ").split(" ");
    var pythonFunctional = "all any enumerate map filter reduce compose max min zip range list sum product ".split(" ").join("() ").split(" ");

    CodeMirror.pythonHint.keywords = _.flatten([pythonBuiltinsL, pythonKeywordsL])
    CodeMirror.pythonHint.pylibKeywords = _.flatten([pythonFunctional, pythonKeywordsL])
})();
