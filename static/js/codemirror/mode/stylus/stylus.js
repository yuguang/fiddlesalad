/**
 * Link to the project's GitHub page:
 * https://github.com/pickhardt/stylus-codemirror-mode
 */
CodeMirror.defineMode('stylus', function() {
    var type;

    function ret(style, tp) {
        type = tp;
        return style;
    }

	function wordRegexp(words) {
        return new RegExp("^((" + words.join(")|(") + "))\\b");
    }

    //html5 tags
    var defines = wordRegexp(["@keyframes", "@font-face", "@media"]);
    var keywords = wordRegexp(["if", "else if", "else", "unless", "for"]);

    var tags = KEYWORDS.HTML_TAGS;

	function inTagsArray(val) {
		for(var i = 0; i < tags.length; i++) {
			if(val === tags[i]) {
				return true;
			}
		}
	}

    var cssProperties = wordRegexp(KEYWORDS.CSS_PROPERTIES);

    function tokenBase(stream, state) {
    	if (stream.match(defines)) {
	    	return "def";
    	} else if (stream.match(keywords)) {
    		return "keyword";
    	} else if (stream.match(cssProperties)) {
    		stream.eatWhile(/[a-z-]/);
			return 'variable';
		}


        var ch = stream.next();

        if (ch == "$") {
            stream.eatWhile(/[\w\-]/);
            return ret("meta", stream.current());
        } else if (ch == "/" && stream.eat("*")) {
            state.tokenize = tokenCComment;
            return tokenCComment(stream, state);
        } else if (ch == "<" && stream.eat("!")) {
            state.tokenize = tokenSGMLComment;
            return tokenSGMLComment(stream, state);
        } else if (ch == "=") ret(null, "compare");
        else if ((ch == "~" || ch == "|") && stream.eat("=")) return ret(null, "compare");
        else if (ch == "\"" || ch == "'") {
            state.tokenize = tokenString(ch);
            return state.tokenize(stream, state);
        } else if (ch == "/") { // lesscss e.g.: .png will not be parsed as a class
            if (stream.eat("/")) {
                state.tokenize = tokenSComment
                return tokenSComment(stream, state);
            } else {
                stream.eatWhile(/[\a-zA-Z0-9\-_.]/);
                if (stream.peek() == ")" || stream.peek() == "/") return ret("string", "string"); //let url(/images/logo.png) without quotes return as string
                return ret("number", "unit");
            }
        } else if (ch == "!") {
            stream.match(/^\s*\w*/);
            return ret("keyword", "important");
        } else if (/\d/.test(ch)) {
            stream.eatWhile(/[\w.%]/);
            return ret("number", "unit");
        } else if (/[,+>*\/]/.test(ch)) { //removed . dot character original was [,.+>*\/]
            return ret(null, "select-op");
        } else if (/[;{}:\[\]()]/.test(ch)) { //added () char for lesscss original was [;{}:\[\]]
            if (ch == ":") {
                stream.eatWhile(/[active|hover|link|visited]/);
                if (stream.current().match(/active|hover|link|visited/)) {
                    return ret("tag", "tag");
                } else {
                    return ret(null, ch);
                }
            } else {
                return ret(null, ch);
            }
        } else if (ch == ".") { // lesscss
            stream.eatWhile(/[\a-zA-Z0-9\-_]/);
            return ret("tag", "tag");
        } else if (ch == "#") { // lesscss
            stream.match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
            if (stream.current().length > 1) {
                if (stream.current().match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/) != null) {
                    return ret("number", "unit");
                } else {
                    stream.eatWhile(/[\w\-]/);
                    return ret("atom", "tag");
                }
            } else {
                stream.eatWhile(/[\w\-]/);
                return ret("atom", "tag");
            }
        } else if (ch == "&") {
            stream.eatWhile(/[\w\-]/);
            return ret(null, ch);
        } else {
            stream.eatWhile(/[\w\\\-_.%]/);
            if (stream.eat("(")) { // lesscss
                return ret(null, ch);
            } else if (stream.current().match(/\-\d|\-.\d/)) { // lesscss match e.g.: -5px -0.4 etc...
                return ret("number", "unit");
            } else if(inTagsArray(stream.current())) { // lesscss match html tags
                return ret("tag", "tag");
            } else if ((stream.peek() == ")" || stream.peek() == "/") && stream.current().indexOf('.') !== -1) {
                return ret("string", "string"); //let url(logo.png) without quotes and froward slash return as string
            } else {
                return false;
            }
        }

    }

    function tokenSComment(stream, state) { // SComment = Slash comment
        stream.skipToEnd();
        state.tokenize = tokenBase;
        return ret("comment", "comment");
    }

    function tokenCComment(stream, state) {
        var maybeEnd = false,
            ch;
        while ((ch = stream.next()) != null) {
            if (maybeEnd && ch == "/") {
                state.tokenize = tokenBase;
                break;
            }
            maybeEnd = (ch == "*");
        }
        return ret("comment", "comment");
    }

    function tokenSGMLComment(stream, state) {
        var dashes = 0,
            ch;
        while ((ch = stream.next()) != null) {
            if (dashes >= 2 && ch == ">") {
                state.tokenize = tokenBase;
                break;
            }
            dashes = (ch == "-") ? dashes + 1 : 0;
        }
        return ret("comment", "comment");
    }

    function tokenString(quote) {
        return function (stream, state) {
            var escaped = false,
                ch;
            while ((ch = stream.next()) != null) {
                if (ch == quote && !escaped) break;
                escaped = !escaped && ch == "\\";
            }
            if (!escaped) state.tokenize = tokenBase;
            return ret("string", "string");
        };
    }

    return {
        startState: function (base) {
            return {
                tokenize: tokenBase
            };
        },

        token: function (stream, state) {
			if (stream.eatSpace()) {
            	return null;
            }
            return state.tokenize(stream, state);
        }
    };
});

CodeMirror.defineMIME('text/stylus', 'stylus');