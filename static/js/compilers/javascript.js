// Check to see if we're running as a Web Worker or in a browser window / global context
if (typeof window === "undefined" && typeof global === "undefined") {
    // Running as Worker
    // Create a console shim (relies on host providing support via onmessage)
    var console = new Object
    console.log = function (message) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            message = "message" in arguments[0] ? arguments[0].message : ""
        } else {
            if (typeof message === "undefined") {
                message = ""
            }
        }
        postMessage({
            type:"console",
            message:message
        })
    }
}

// Define global object and constructor
var JS11 = new Object
JS11.Compiler = new Function

// Export constructor for CommonJS
if (typeof exports !== "undefined") {
    exports.Compiler = JS11.Compiler
}
;

// Define constructor prototype
(function (compiler) {

    // Main compilation function
    compiler.toJS = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }

        // Process text
        this.text = text
        this.replaceForComprehension()
        this.resetPlaceholderArrays()
        this.strikeImmutableElements()
        this.normaliseFormatting()
        this.detectNonEmptyObjectLiterals()
        this.preserveEmptyObjectLiterals()
        this.wrapLoopsAndConditionals()
        this.shorthandLoops()
        this.reconstituteFunctions()
        this.reconstituteObjectLiterals()
        this.convertNamedArguments()
        this.rewriteWith()
        this.separateAdjacentTerminators()
        this.restoreImmutables()
        this.finalise()
        this.resetPlaceholderArrays()
        text = this.text
        this.text = ""
        return text
    }

    // Set up text for conversion and placeholder arrays
    compiler.text = ""
    compiler.placeholders = new Object
    compiler.resetPlaceholderArrays = function () {
        this.placeholders.blockcomments = new Array
        this.placeholders.linecomments = new Array
        this.placeholders.strings = new Array
        this.placeholders.regex = new Array
    }

    //
    // Pass-through text processing functions
    //
    compiler.enumerateRegex = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        var prefix = "",
            suffix = ""
        if (text.charAt(0) !== "/") {
            prefix = text.substr(0, text.indexOf("/"))
            text = text.substring(text.indexOf("/"), text.length)
        }
        if (text.charAt(text.length - 1).match(/[\/gimy]/) === null) {
            suffix = text.charAt(text.length - 1)
            text = text.substring(0, text.length - 1)
        }
        this.placeholders.regex.push(text)
        return prefix + "@PLACEHOLDERREGEX" + (this.placeholders.regex.length - 1) + "END" + suffix
    }
    compiler.enumerateString = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        // If indenting on first line is nil but +1 on all other lines,
        // then reduce the other lines by the lower common amount
        if (text.match(/\n/) !== null) {
            var lines = text.split("\n")
            var indent = Infinity
            var lastIndentType
            var indentAgreement = true
            if (lines[0].match(/^ +/) === null) {
                for (var i = 1; i < lines.length; i++) {
                    var trimmed = lines[i].replace(/^( +|\t+)[^\1][\s\S]*$/, "$1")
                    if (trimmed !== lines[i]) {
                        if (trimmed.charAt(0) !== lastIndentType && i > 1) {
                            indentAgreement = false
                            break
                        }
                        indent = Math.min(trimmed.length, indent)
                        lastIndentType = trimmed.charAt(0)
                    } else {
                        indent = 0
                    }
                }
            }
            if (indent > 0 && indent < Infinity && indentAgreement === true) {
                for (var i = 1; i < lines.length; i++) {
                    lines[i] = lines[i].substring(indent, lines[i].length)
                }
                text = lines.join("\n")
            }
        }
        this.placeholders.strings.push(text)
        return "@PLACEHOLDERSTRINGS" + (this.placeholders.strings.length - 1) + "END"
    }
    compiler.enumerateBlockComment = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        var prefix = ""
        if (text.charAt(0) !== "/") {
            prefix = text.charAt(0)
            text = text.substring(1, text.length)
        }
        this.placeholders.blockcomments.push(text)
        return prefix + "@PLACEHOLDERBLOCKCOMMENTS" + (this.placeholders.blockcomments.length - 1) + "END"
    }
    compiler.enumerateLineComment = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        var prefix = "",
            suffix = ""
        if (text.charAt(0) !== "/") {
            prefix = text.charAt(0)
            text = text.substring(1, text.length)
        }
        if (text.charAt(text.length - 1) === "\n") {
            suffix = "\n"
            text = text.substring(0, text.length - 1)
        }
        this.placeholders.linecomments.push(text)
        return prefix + "@PLACEHOLDERLINECOMMENTS" + (this.placeholders.linecomments.length - 1) + "END" + suffix
    }
    compiler.getPlaceholder = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        var type = text.replace(/@PLACEHOLDER([^\d]+)\d+END/, "$1").toLowerCase(),
            index = Number(text.replace(/@PLACEHOLDER[^\d]+(\d+)END/, "$1"))
        return this.placeholders[type][index]
    }
    compiler.preserveKeywordSpacing = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        if (text.charAt(1).match(/^\w/) === null) {
            return text.replace(/^ *([\(\)\{\}\=\:,\|\&\*\+\/\-\!\[\]\?<>\;]) */, "$1")
        } else {
            return text.replace(/([\s\S])(\w+) *([\(\)\{\}\=\:,\|\&\*\+\/\-\!\[\]\?<>\;]) */, "$1$2 $3")
        }
    }
    compiler.restoreObjectLiteral = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        var depth = 0,
            start = text.indexOf("("),
            i
        for (i = start; i < text.length; i++) {
            if (text.charAt(i).match(/\(/) !== null) {
                depth++
            } else if (text.charAt(i).match(/\)/) !== null) {
                depth--
            }
            if (depth === 0) {
                break
            }
        }
        return "{" + text.substring(start + 1, i) + "}" + text.substring(i + 1, text.length)
    }
    compiler.withHandler = function (text) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            text = "text" in arguments[0] ? arguments[0].text : ""
        } else {
            if (typeof text === "undefined") {
                text = ""
            }
        }
        // Search for closing }
        var level = 0,
            endIndex = 0,
            startIndex = text.indexOf("with"),
            i, block, argString = "",
            args = new Array,
            prefix = "",
            depth, lastComma

        for (i = startIndex; i < text.length; i++) {
            if (text.charAt(i).match(/[\(\{]/) !== null) {
                level++
                if (level === 1 && text.charAt(i) === "{") {
                    // Start of actual block
                    startIndex = i
                }
            } else if (text.charAt(i).match(/[\}\)]/) !== null) {
                level--
                if (level === 0) {
                    if (text.charAt(i) === ")") {
                        // End of arguments
                        argString = text.substring(text.substring(startIndex, i).indexOf("(") + (startIndex + 1), i)
                    } else if (text.charAt(i) === "}") {
                        // End of block
                        endIndex = i
                        break
                    }
                }
            }
        }
        if (endIndex === 0) {
            return text
        }
        block = text.substring(startIndex + 1, endIndex)
        // Check for "as" modifier(s)
        if (argString.match(/as [a-zA-Z$_][\w$]*$/) !== null) {
            // Loop through args and add to an array with each top-level comma found
            depth = 0
            lastComma = -1
            for (i = 0; i < argString.length; i++) {
                if (argString.charAt(i).match(/[\{\(\[]/) !== null) {
                    depth++
                }
                if (argString.charAt(i).match(/[\}\)\]]/) !== null) {
                    depth--
                }
                if (depth === 0 && argString.charAt(i) === ",") {
                    args.push(argString.substring(lastComma + 1, i))
                    lastComma = i
                    i++
                }
                if (i === argString.length - 1) {
                    args.push(argString.substring(lastComma + 1, i + 1))
                }
            }
            argString = ""
            for (i = 0; i < args.length; i++) {
                prefix += args[i].replace(/[\s\S]*as ([a-zA-Z$_][\w$]*)$/, "$1") + ","
                argString += args[i].replace(/([\s\S]*[^\s]+)\s*as [a-zA-Z$_][\w$]*$/, "$1") + ","
            }
            block = "(function (" + prefix.substring(0, prefix.length - 1) + "){" + block + "}).call(this," + argString.substring(0, argString.length - 1) + ")"
            text = text.substring(0, text.indexOf("with")) + block + text.substring(endIndex + 1, text.length)
        }
        return text
    }

    //
    // Functions that operate on compiler.text
    //
    compiler.strikeImmutableElements = function (compiler) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            compiler = "compiler" in arguments[0] ? arguments[0].compiler : this
        } else {
            if (typeof compiler === "undefined") {
                compiler = this
            }
        }
        // "isn't"
        this.text = this.text.replace(/isn't/g, "@PLACEHOLDER" + "ISNTEND")
        // Double forward slash
        this.text = this.text.replace(/([^\\])\/\//g, "$1@PLACEHOLDER" + "DOUBLEFORWARDSLASHEND")
        // Regular Expressions
        this.text = this.text.replace(/[^\/\w"']\/[^\/\*\n]([^\n]*?[^\\\n])?\/[gimy]{0,4}/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.enumerateRegex.call(compiler, text)
        })
        // Reinstate double forward slash
        this.text = this.text.replace(/@PLACEHOLDER{1}DOUBLEFORWARDSLASHEND/g, "//")
        // Strings
        this.text = this.text.replace(/(["'])(\\\1|[^\1\n]|\\\n)*?\1/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.enumerateString.call(compiler, text)
        })
        // Comments
        this.text = this.text.replace(/\/\*[\s\S]*?\*\//g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.enumerateBlockComment.call(compiler, text)
        })
        this.text = this.text.replace(/\/\/[^\n]*\n/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.enumerateLineComment.call(compiler, text)
        })
        // Reinstate isn't
        this.text = this.text.replace(/@PLACEHOLDER{1}ISNTEND/g, "isn't")
    }
    compiler.normaliseFormatting = function (compiler) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            compiler = "compiler" in arguments[0] ? arguments[0].compiler : this
        } else {
            if (typeof compiler === "undefined") {
                compiler = this
            }
        }
        // Remove function keyword
        this.text = this.text.replace(/([^\w\$])function[ \t]*([^\w\$])/g, "$1$2")
        this.text = this.text.replace(/^function[ \t]*((?: *\n* *)*)([^\w\$])/, "$1$2")
        // Strip optional colon from conditional keywords
        this.text = this.text.replace(/([^\w\$])(if|for|while|catch|switch):/g, "$1$2")
        // Remove spaces near punctuation whilst preserving minimum keyword spacing
        this.text = this.text.replace(/(([^\w\$](if|for|while|catch|return|switch|typeof|instanceof|in|throw|finally))| *) *([\(\)\{\}\=\:,\|\&\*\+\/\-\!\[\]\?<>\;]) */g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.preserveKeywordSpacing.call(compiler, text)
        })
        // Rearrange newlines after : or ? to stop anonymous functions inside ternary expressions from auto-executing
        this.text = this.text.replace(/([:\?])((?: *\n* *)*)((?:@PLACEHOLDER[A-Z]+COMMENTS+\d+END\s*)*)((?: *\n* *)*)(\S)/g, "$2$3$4$1$5")
    }
    compiler.replaceForComprehension = function () {
        this.text = this.text.replace(/([\w]+)\s=\sfor\s\(/g, '$1 = new Array;\nfor (')
        this.text = this.text.replace(/([\w]+)\s=\svar\s_\$tmp/g, '$1 = new Array;\nvar _$tmp')
    }
    compiler.insertVar = function () {
        // Convert vars at line starts and inside parentheses
        this.text = this.text.replace(/^(\s*)(\(?)\* *(\n*) */gm, "$1$2var $2")
        this.text = this.text.replace(/([\({;:])\* *(\n*) */g, "$1var $2")
    }
    compiler.detectNonEmptyObjectLiterals = function () {
        var depth = 0,
            namey = false,
            end = this.text.lastIndexOf("}") + 1,
            stops = [],
            i, start, offset = 0,
            tag = "OBJECTLITERALSTART"
        for (i = 0; i < this.text.length; i++) {
            if (this.text.charAt(i) === "{") {
                stops.push(i)
            }
        }
        for (i = start = stops.shift(); i <= end; i++) {
            if (this.text.charAt(i).match(/[\({]/) !== null) {
                depth++
            } else if (this.text.charAt(i).match(/[\)}]/) !== null) {
                depth--
            }
            // Disregard lines with likely ternary operators on them for inferring nameyness
            if (depth === 1 && this.text.charAt(i) === ":" && this.text.substring(start, i).match(/\?|case/i) === null) {
                namey = true
            }
            if (i > start + 250 && namey === false) {
                depth = 0
                i = start = stops.shift() + offset
                i--
                continue
            }
            if (depth === 0) {
                if (namey === true && this.text.charAt(i) === "}") {
                    this.text = this.text.substring(0, start) + tag + "(" + this.text.substring(start + 1, i) + ")" + this.text.substring(i + 1, this.text.length)
                    offset += 18
                    end += 18 // to account for addition of tag
                }
                namey = false
                depth = 0
                i = start = stops.shift() + offset
                i--
            }
        }
    }
    compiler.preserveEmptyObjectLiterals = function () {
        this.text = this.text.replace(/([\[\=\|\:\&\!\(,\}\(]|return\s*)\{\}/g, "$1OBJECTLITERALSTART()")
    }
    compiler.wrapLoopsAndConditionals = function () {
        var search = /[^\w\$](if|for|while|catch|switch|with)[^\w\$]/g,
            stops = new Array,
            i, j, startPoint, depth, segments, character

        if (this.text.match(/^(if|for|while|catch|switch|with)[^\w\$]/) !== null) {
            stops.push(this.text.replace(/^(if|for|while|catch|switch|with)[\s\S]*$/, "$1").length)
        }

        // Find all the keywords that could be followed by an expression that needs wrapping
        while (search.exec(this.text) !== null) {
            if (this.text.substring(0, search.lastIndex - 1).match(/\} *while$/) === null) {
                stops.push(search.lastIndex - 1)
            }
        }

        stops.reverse()

        // Scan backwards
        for (i = 0; i < stops.length; i++) {
            // Walk forwards until the first { at depth 0
            startPoint = stops[i]
            depth = 0
            segments = 0
            for (j = startPoint; j < this.text.length; j++) {
                character = this.text.charAt(j)
                if (character === "(") {
                    // Every time depth is 0 and the current character is a (, register a new segment
                    if (depth === 0) {
                        segments++
                    }
                    depth++
                }
                if (character === ")") {
                    depth--
                }
                if (depth < 0) {
                    break
                }
                if (depth === 0 && character === "{") {
                    expression = this.text.substring(startPoint, j)
                    // If the expression doesn't begin and end with ( and ), wrap it
                    // If the expression begins and ends with ( and ), wrap it *only* if segments > 1
                    if (expression.match(/^\s*\([\s\S]*\)\s*$/) === null || segments > 1) {
                        this.text = this.text.substring(0, startPoint) + "(" + expression.replace(/^\s*([\s\S]*?)\s*$/, "$1") + ")" + this.text.substring(j, this.text.length)
                    }
                    break
                }
            }
        }

        // Whitespace cleanup (in case parameters were wrapped already)
        this.text = this.text.replace(/([^\w\$])(if|for|while|catch|switch|with)\s*/g, "$1$2")
    }
    compiler.shorthandLoops = function () {
        var iterator
        // 10 { becomes for (var _nnn = 0; _nnn < 10; _nnn++) {
        while (this.text.match(/([^\w\d$])(\d+)[ \t]*\{/) !== null) {
            iterator = "_" + Math.ceil(Math.random() * 1000)
            this.text = this.text.replace(/([^\w\d$])(\d+)[ \t]*\{/, "$1for(var " + iterator + "=0;" + iterator + "<$2;" + iterator + "++){")
        }
        while (this.text.match(/([^\w\d$])for\s*\(\s*(\d+)\s*\)[ \t]*\{/) !== null) {
            iterator = "_" + Math.ceil(Math.random() * 1000)
            this.text = this.text.replace(/([^\w\d$])for\s*\(\s*(\d+)\s*\)[ \t]*\{/, "$1for(var " + iterator + "=0;" + iterator + "<$2;" + iterator + "++){")
        }
        // 10 as i { becomes for (var i = 0...
        this.text = this.text.replace(/([^\w\d$])(\d+)\s*as\s+([a-zA-Z_\$][\w$]*)[ \t]*\{/, "$1for(var $3=0;$3<$2;$3++){")
        this.text = this.text.replace(/([^\w\d$])for\s*\(\s*(\d+)\s*as\s+([a-zA-Z_$][\w$]*)\s*\)[ \t]*\{/, "$1for(var $3=0;$3<$2;$3++){")
    }
    compiler.reconstituteFunctions = function () {
        // Problem: functions that get transferred to argument blocks end up mangled
        // Rather than barring functions from being used in argument default values,
        // figure out a way to make this work.
        var opens = new Array,
            prefixes = new Array,
            i, j, k, prefix, dotted, lastChar, depth, args, id, inline, arg, argBlock, cleanArgs, nonObjectArgBlock, inlines = 0,
            tagStart, tagEnd, opener, closer

        for (i = 0; i < this.text.length; i++) {
            if (this.text.charAt(i) === "{") {
                opens.push(i)
            }
        }
        for (i = opens.length - 1; i >= 0; i--) {
            prefix = ""
            dotted = false
            // scan backwards from open to see if we arrive at a line break
            for (j = opens[i] - 1; j >= 0; j--) {
                if (this.text.charAt(j).match(/[\n]/) !== null) {
                    prefix = this.text.substring(j + 1, opens[i])
                    break
                } else if (j === 0) {
                    prefix = this.text.substring(j, opens[i])
                }
            }
            prefix = prefix.replace(/^\s*/, "")
            // Cases
            lastChar = prefix.charAt(prefix.length - 1)
            if (prefix === "") { /* we have an inline function literal */
                prefixes.push({
                    raw:prefix,
                    flags:[0, -1, 1, "anonymous inline, no args"],
                    start:opens[i],
                    end:opens[i] - 1
                })
            }
            // Ignore if prefix ends with a keyword or a Prism eval block start marker
            else if (prefix.match(/[^\w\$](else|finally|try|do|PRISMEVALBLOCKSTART)$/) !== null || prefix.match(/^(else|finally|try|do|PRISMEVALBLOCKSTART)$/) !== null) {
                continue
            } else if (lastChar === ")") {
                // Look back for a matched set of (), and a possible identifier
                depth = 0
                args = ""
                id = ""
                inline = false
                for (k = prefix.length - 1; k >= 0; k--) {
                    if (prefix.charAt(k) === ")") {
                        depth++
                    }
                    if (prefix.charAt(k) === "(") {
                        depth--
                    }
                    if (depth === 0) {
                        args = prefix.substr(k, prefix.length)
                        break
                    }
                }
                // If params were unmatched, just ignore
                if (args === "") {
                    continue
                }
                // Extract identifier
                id = prefix.substring(0, k).replace(/[\s\S]*?\s*(\.?)\s*((?:[a-zA-Z_\$][\w\$]*)|\])?$/, "$1$2")
                // Dotted?
                if (id.charAt(0) === ".") {
                    dotted = true;
                    id = id.substring(1, id.length)
                }
                if (id.charAt(id.length - 1) === "]") {
                    dotted = true;
                    id = "]"
                } // array access counts as dotted
                // Ignore ids that are keywords
                if (prefix.length === (id + args).length) {
                    inline = true
                }
                prefix = id + args
                // Ignore identifiers starting with numbers or keywords
                if (prefix.match(/^(if|for|while|catch|switch|with)[^\w\$]/) !== null || prefix.match(/^\d/) !== null) {
                    continue
                }
                if (args === "()") {
                    if (id === "") {
                        if (inline === false) {
                            prefixes.push({
                                raw:prefix,
                                flags:[0, 0, 0, "anonymous, empty args"],
                                start:opens[i] - prefix.length,
                                end:opens[i] - 1
                            })
                        } else {
                            prefixes.push({
                                raw:prefix,
                                flags:[0, 0, 1, "anonymous, empty args (inline)"],
                                start:opens[i] - prefix.length,
                                end:opens[i] - 1
                            })
                        }
                    } else {
                        prefixes.push({
                            raw:prefix,
                            flags:[1, 0, 0, "id, empty args"],
                            start:opens[i] - prefix.length,
                            end:opens[i] - 1,
                            dotted:dotted
                        })
                    }
                } else {
                    if (id === "") {
                        if (args.indexOf("=") !== -1) {
                            if (inline === false) {
                                prefixes.push({
                                    raw:prefix,
                                    flags:[0, 2, 0, "anonymous, args with default"],
                                    start:opens[i] - prefix.length,
                                    end:opens[i] - 1,
                                    args:args.substring(1, args.length - 1)
                                })
                            } else {
                                prefixes.push({
                                    raw:prefix,
                                    flags:[0, 2, 1, "anonymous, args with default (inline)"],
                                    start:opens[i] - prefix.length,
                                    end:opens[i] - 1,
                                    args:args.substring(1, args.length - 1)
                                })
                            }
                        } else {
                            if (inline === false) {
                                prefixes.push({
                                    raw:prefix,
                                    flags:[0, 1, 0, "anonymous, args"],
                                    start:opens[i] - prefix.length,
                                    end:opens[i] - 1,
                                    args:args.substring(1, args.length - 1)
                                })
                            } else {
                                prefixes.push({
                                    raw:prefix,
                                    flags:[0, 1, 1, "anonymous, args (inline)"],
                                    start:opens[i] - prefix.length,
                                    end:opens[i] - 1,
                                    args:args.substring(1, args.length - 1)
                                })
                            }
                        }
                    } else {
                        if (args.indexOf("=") !== -1) {
                            prefixes.push({
                                raw:prefix,
                                flags:[1, 2, 0, "id, args with default"],
                                start:opens[i] - prefix.length,
                                end:opens[i] - 1,
                                args:args.substring(1, args.length - 1),
                                dotted:dotted
                            })
                        } else {
                            prefixes.push({
                                raw:prefix,
                                flags:[1, 1, 0, "id, args"],
                                start:opens[i] - prefix.length,
                                end:opens[i] - 1,
                                args:args.substring(1, args.length - 1),
                                dotted:dotted
                            })
                        }
                    }
                }
            } else if (lastChar === "?" || lastChar === ":" || lastChar === "=" || lastChar === "," || prefix === "return ") {
                // No args or identifier, we need an anonymous -- deferred -- function
                // Only inline function literals should execute immediately
                prefix = ""
                prefixes.push({
                    raw:prefix,
                    flags:[0, -1, 0, "anonymous assignment or ternary, no args"],
                    start:opens[i],
                    end:opens[i] - 1
                })
            } else if (lastChar === ";") {
                // No args or identifier, but it's inline
                prefix = ""
                prefixes.push({
                    raw:prefix,
                    flags:[0, -1, 1, "anonymous assignment, no args (inline)"],
                    start:opens[i],
                    end:opens[i] - 1
                })
            } else if (prefix.match(/\s*\.?\s*[a-zA-Z_\$][\w\$]*$/) !== null) {
                // Dotted?
                prefix = prefix.replace(/[\s\S]*?(\.?)\s*([a-zA-Z_\$][\w\$]*)$/, "$1$2")
                if (prefix.charAt(0) === ".") {
                    dotted = true
                    prefix = prefix.substring(1, prefix.length)
                }
                prefixes.push({
                    raw:prefix,
                    flags:[1, -1, 0, "id, no args"],
                    start:opens[i] - prefix.length,
                    end:opens[i] - 1,
                    dotted:dotted
                })
            } else if (lastChar === "]") {
                // Assume array access and behave as if it's dotted
                prefix = ""
                dotted = true
                prefixes.push({
                    raw:prefix,
                    flags:[1, -1, 0, "array access, no args"],
                    start:opens[i],
                    end:opens[i] - 1,
                    dotted:dotted
                })
            } else if (prefix.match(/^.*[\?\:\=]\s*[a-zA-Z_\$][\w\$]*$/) !== null) {
                prefix = prefix.replace(/^.*[\?\:\=]\s*([a-zA-Z_\$][\w\$]*)$/, "$1")
                prefixes.push({
                    raw:prefix,
                    flags:[1, -1, 0, "id assignment or ternary, no args"],
                    start:opens[i] - prefix.length,
                    end:opens[i] - 1
                })
            } else if (lastChar === "(") {
                prefixes.push({
                    raw:"",
                    flags:[0, -1, 0, "anonymous wrapped in parens, no args"],
                    start:opens[i],
                    end:opens[i] - 1
                })
            } else {
                prefixes.push({
                    raw:prefix,
                    flags:[-1, "unclassified"],
                    start:j,
                    end:opens[i] - 1
                })
            }
            prefixes[prefixes.length - 1].argBlock = ""
        }
        // What we want is the prefix start and end point, and its type.
        // We also need to know the start and end points of the block body.
        /*
         if a function has arguments and a body, then it needs an object-argument block
         if one or more of those arguments has a stated default, then that needs to be set in the o-a block
         if the function has no body, then arguments do nothing so we can forget them
         if the function has no arguments, the point is moot...
         if a function is not being assigned and has no id provided, it MUST be wrapped in parens and executed
         if a function id is dotted or has array syntax, then an = should be added
         */
        for (i = 0; i < prefixes.length; i++) {
            if (prefixes[i].raw.substr(0, 19) === "MESSAGEHANDLERSTART") {
                // Alternate logic for message handlers
                var argString = prefixes[i].args || new Array
                var argStart = 0
                depth = 0
                args = new Array
                for (j = 0; j < argString.length; j++) {
                    if (argString.charAt(j).match(/[\(\{\[]/) !== null) {
                        depth++
                    } else if (argString.charAt(j).match(/[\)\}\]]/) !== null) {
                        depth--
                    }
                    if (argString.charAt(j) === "," && depth === 0) {
                        args.push(argString.substring(argStart, j))
                        argStart = j + 1
                    } else if (j === argString.length - 1) {
                        args.push(argString.substring(argStart, j + 1))
                    }
                }
                argBlock = ""
                for (j = args.length - 1; j >= 0; j--) {
                    arg = args[j].split("=")
                    if (arg.length > 1) {
                        argBlock += "if(typeof " + arg[0] + "!==\"undefined\"){" + arg[0] + "=" + arg[1] + "}"
                    }
                }
                prefixes[i].argBlock = argBlock
                prefixes[i].raw = prefixes[i].raw.substring(19, prefixes[i].raw.length)
                cleanArgs = ""
                for (j = 0; j < args.length; j++) {
                    if (args[j].match(/\=/) !== null) {
                        cleanArgs += args[j].split("=")[0] + ","
                    } else {
                        cleanArgs += args[j] + ","
                    }
                }
                prefixes[i].args = cleanArgs.substring(0, cleanArgs.lastIndexOf(","))
                continue
            }
            if (this.text.charAt(prefixes[i].end + 1) !== "}") {
                prefixes[i].hasBody = true
            }
            // Filter default arguments, prep object block
            if (prefixes[i].flags[1] > 0) {
                // We have arguments, do we have a body?
                if (prefixes[i].hasBody) {
                    argBlock = "if(arguments.length===1&&typeof arguments[0]===\"object\"&&arguments[0]._===null){"
                    if (prefixes[i].flags[1] === 2) {
                        // Do something with the defaults
                        // Can't split by commas in case a default also contains a list
                        var argString = prefixes[i].args
                        var argStart = 0
                        depth = 0
                        args = new Array
                        for (j = 0; j < argString.length; j++) {
                            if (argString.charAt(j).match(/[\(\{\[]/) !== null) {
                                depth++
                            } else if (argString.charAt(j).match(/[\)\}\]]/) !== null) {
                                depth--
                            }
                            if (argString.charAt(j) === "," && depth === 0) {
                                args.push(argString.substring(argStart, j))
                                argStart = j + 1
                            } else if (j === argString.length - 1) {
                                args.push(argString.substring(argStart, j + 1))
                            }
                        }
                        cleanArgs = ""
                        for (j = 0; j < args.length; j++) {
                            if (args[j].match(/\=/) !== null) {
                                arg = args[j].split("=")
                                cleanArgs += arg[0] + ","
                            } else {
                                cleanArgs += args[j] + ","
                            }
                        }
                        prefixes[i].args = cleanArgs.substring(0, cleanArgs.lastIndexOf(","))
                        // Cycle through args in reverse order so the arguments object isn't messed up
                        // (ie assigning a value to a local var with the same name as the first argument deletes our object)
                        for (j = args.length - 1; j >= 0; j--) {
                            if (args[j].match(/\=/) !== null) {
                                arg = args[j].split("=")
                                if (j > 0) {
                                    argBlock += arg[0] + "=\"" + arg[0] + "\"in arguments[0]?arguments[0]." + arg[0] + ":" + arg[1] + ";"
                                } else {
                                    // Leave off the unnecessary semicolon
                                    argBlock += arg[0] + "=\"" + arg[0] + "\"in arguments[0]?arguments[0]." + arg[0] + ":" + arg[1]
                                }
                            } else {
                                if (j > 0) {
                                    argBlock += "if(\"" + args[j] + "\"in arguments[0]){" + args[j] + "=arguments[0]." + args[j] + "}"
                                } else {
                                    // Make sure the first argument is cleaned up in case it's not named in the object
                                    argBlock += args[j] + "=\"" + args[j] + "\"in arguments[0]?arguments[0]." + args[j] + ":undefined"
                                }
                            }
                        }
                        argBlock += "}else{"
                        nonObjectArgBlock = ""
                        for (j = args.length - 1; j >= 0; j--) {
                            if (args[j].match(/\=/) !== null) {
                                arg = args[j].split("=")
                                argBlock += "if(typeof " + arg[0] + "===\"undefined\"){" + arg[0] + "=" + arg[1] + "}"
                                nonObjectArgBlock += "if(typeof " + arg[0] + "===\"undefined\"){" + arg[0] + "=" + arg[1] + "}"
                            }
                        }
                    } else {
                        // Just iterate over the arguments with no regard for default values (there aren't any)
                        args = prefixes[i].args.split(",")
                        for (j = args.length - 1; j >= 0; j--) {
                            if (j > 0) {
                                argBlock += "if(\"" + args[j] + "\"in arguments[0]){" + args[j] + "=arguments[0]." + args[j] + "}"
                            } else {
                                // Make sure the first argument is cleaned up in case it's not named in the object
                                argBlock += args[j] + "=\"" + args[j] + "\"in arguments[0]?arguments[0]." + args[j] + ":undefined"
                            }
                        }
                    }
                    argBlock += "}"
                    prefixes[i].argBlock = argBlock
                    prefixes[i].altargBlock = nonObjectArgBlock
                } else if (prefixes[i].flags[1] === 2) {
                    // We need to screen out the defaults and provide a clean args string
                    args = prefixes[i].args.split(",")
                    cleanArgs = ""
                    for (j = 0; j < args.length; j++) {
                        if (args[j].match(/\=/) !== null) {
                            cleanArgs += args[j].split("=")[0] + ","
                        } else {
                            cleanArgs += args[j] + ","
                        }
                    }
                    prefixes[i].args = cleanArgs.substring(0, cleanArgs.lastIndexOf(","))
                }
            }
            if (prefixes[i].flags[1] === 0) {
                prefixes[i].args = ""
            }
        }
        // Iterate through each prefix
        // Cut up the main text at the start and stop points,
        // Insert recomputed prefix text, inject any argBlock, and wrap if necessary
        inlines = 0
        for (i = 0; i < prefixes.length; i++) {
            prefix = prefixes[i]
            inline = false
            // We only want { // } or (...){ // } to be treated as inline, named or assigned functions should be left as-is
            if (prefix.flags[2] === 1 && prefix.flags[0] === 0) {
                prefixStr = "INLINEFUNCTIONSTARTfunction "
                inlines++
                inline = true
            } else {
                prefixStr = "function "
            }
            // Skip everything that's unclassified at this point
            if (prefix.flags[0] !== -1) {
                if (prefix.flags[0] === 0) {
                    // No id
                    if (prefix.flags[1] !== -1) {
                        prefixStr += "(" + prefix.args + ")"
                    } else {
                        prefixStr += "()"
                    }
                } else if (prefix.flags[0] === 1) {
                    // Id
                    if (prefix.flags[1] !== -1) {
                        if (prefix.dotted) {
                            prefixStr = prefix.raw.substring(0, prefix.raw.indexOf("(")) + "=function (" + prefix.args + ")"
                        } else {
                            prefixStr += prefix.raw.substring(0, prefix.raw.indexOf("(")) + "(" + prefix.args + ")"
                        }
                    } else {
                        if (prefix.dotted) {
                            prefixStr = prefix.raw + "=function ()"
                        } else {
                            prefixStr += prefix.raw + "()"
                        }
                    }
                }
                prefixStr += "{" + (inline && prefix.altargBlock ? prefix.altargBlock : prefix.argBlock)
                this.text = this.text.substring(0, prefix.start) + prefixStr + this.text.substring(prefix.end + 2, this.text.length)
            }
        }
        for (i = 0; i < inlines; i++) {
            tagstart = this.text.indexOf("INLINEFUNCTIONSTART")
            tagend = tagstart + 19
            this.text = this.text.substr(0, tagstart) + "(" + this.text.substring(tagend, this.text.length)
            depth = 0
            opener = "("
            closer = ")"
            for (j = tagstart + 1; j < this.text.length; j++) {
                if (this.text.charAt(j) === opener) {
                    depth++
                }
                if (this.text.charAt(j) === closer) {
                    depth--
                }
                if (depth === 0 && this.text.charAt(j) === ")") {
                    opener = "{"
                    closer = "}"
                } else if (depth === 0 && this.text.charAt(j) === "}") {
                    this.text = this.text.substr(0, j + 1) + ").call(this)" + this.text.substring(j + 1, this.text.length)
                    break
                }
            }
        }
    }
    compiler.reconstituteObjectLiterals = function (compiler) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            compiler = "compiler" in arguments[0] ? arguments[0].compiler : this
        } else {
            if (typeof compiler === "undefined") {
                compiler = this
            }
        }
        // Convert tagged object literals back to normal
        var oldtext = ""
        while (this.text !== oldtext) {
            oldtext = this.text
            this.text = this.text.replace(/OBJECTLITERALSTART\([\s\S]*\)/, function (text) {
                if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                    text = "text" in arguments[0] ? arguments[0].text : undefined
                }
                return compiler.restoreObjectLiteral.call(compiler, text)
            })
        }
    }
    compiler.convertNamedArguments = function () {
        // Normalise spacing but don't break newlines
        this.text = this.text.replace(/new[ \t]*Object/, "new Object")

        var depth = 0,
            namey = false,
            end = this.text.lastIndexOf(")") + 1,
            stops = [],
            search = /new Object\(/g,
            i, j

        // Treat "new Object" calls (with arguments) differently by converting them to {} syntax
        while (search.exec(this.text) !== null) {
            stops.push(search.lastIndex - 1)
        }
        offset = 0
        for (j = 0; j < stops.length; j++) {
            depth = 0
            namey = false
            for (i = start = stops.pop(); i <= end; i++) {
                if (this.text.charAt(i).match(/[\(\{]/) !== null) {
                    depth++
                } else if (this.text.charAt(i).match(/[\)\}]/) !== null) {
                    depth--
                }
                if (depth === 1 && this.text.charAt(i) === ":" && this.text.substring(start, i).match(/\?/) === null) {
                    namey = true
                }
                if (depth === 0) {
                    if (namey === true && this.text.charAt(i) === ")") {
                        this.text = this.text.substring(0, start - 10) + "{" + this.text.substring(start + 1, i) + "}" + this.text.substring(i + 1, this.text.length)
                    }
                    namey = false
                    i = start = stops.pop()
                    i--
                }
            }
            end = i
        }
        // Detect named arguments in parentheses and create object literal
        depth = 0
        namey = false
        end = this.text.lastIndexOf(")") + 1
        stops = []
        for (i = 0; i < this.text.length; i++) {
            if (this.text.substr(i, 2).match(/^\([^\{\)\[]/) !== null) {
                stops.push(i)
            }
        }
        offset = 0
        for (j = 0; j < stops.length; j++) {
            depth = 0
            namey = false
            for (i = start = stops.pop(); i <= end; i++) {
                if (this.text.charAt(i).match(/[\(\{]/) !== null) {
                    depth++
                } else if (this.text.charAt(i).match(/[\)\}]/) !== null) {
                    depth--
                }
                if (depth === 1 && this.text.charAt(i) === ":" && this.text.substring(start, i).match(/\?/) === null) {
                    namey = true
                }
                if (depth === 0) {
                    if (namey === true && this.text.charAt(i) === ")") {
                        this.text = this.text.substring(0, start) + "({_:null," + this.text.substring(start + 1, i) + "})" + this.text.substring(i + 1, this.text.length)
                    }
                    namey = false
                    i = start = stops.pop()
                    i--
                }
            }
            end = i
        }
    }
    compiler.rewriteWith = function (compiler) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            compiler = "compiler" in arguments[0] ? arguments[0].compiler : this
        } else {
            if (typeof compiler === "undefined") {
                compiler = this
            }
        }
        // Hijack with...as statements
        this.text = this.text.replace(/^with[^\w\$][\s\S]*}/, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.withHandler.call(compiler, text)
        })
        var oldText
        while (this.text.match(/[^\w\$]with[^\w\$][\s\S]*}/) !== null && this.text !== oldText) {
            oldText = this.text
            this.text = this.text.replace(/[^\w\$]with[^\w\$][\s\S]*}/g, function (text) {
                if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                    text = "text" in arguments[0] ? arguments[0].text : undefined
                }
                return compiler.withHandler.call(compiler, text)
            })
        }
    }
    compiler.separateAdjacentTerminators = function () {
        // Insert semicolon between terminators separated by newlines and/or comments
        this.text = this.text.replace(/([\)}\w\$])(\s*?\n((?:@PLACEHOLDER[A-Z]+COMMENTS+\d+END\s*)*)\s*?\()/g, "$1;$2")
    }
    compiler.restoreImmutables = function (compiler) {
        if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
            compiler = "compiler" in arguments[0] ? arguments[0].compiler : this
        } else {
            if (typeof compiler === "undefined") {
                compiler = this
            }
        }
        this.text = this.text.replace(/@PLACEHOLDERBLOCKCOMMENTS\d+END/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.getPlaceholder.call(compiler, text)
        })
        this.text = this.text.replace(/@PLACEHOLDERLINECOMMENTS\d+END/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.getPlaceholder.call(compiler, text)
        })
        // Repeat in case a line comment contains a block comment...
        this.text = this.text.replace(/@PLACEHOLDERBLOCKCOMMENTS\d+END/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.getPlaceholder.call(compiler, text)
        })
        this.text = this.text.replace(/@PLACEHOLDERSTRINGS\d+END/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.getPlaceholder.call(compiler, text)
        })
        this.text = this.text.replace(/@PLACEHOLDERREGEX\d+END/g, function (text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : undefined
            }
            return compiler.getPlaceholder.call(compiler, text)
        })
        this.text = this.text.replace(/@PLACEHOLDER{1}ISNTEND/g, "isn't")
    }
    compiler.finalise = function () {
        // Insert semicolon between terminators separated by one or more newlines
        this.text = this.text.replace(/([\)}])(\s*?\n\s*?\()/g, "$1;$2")

        // Resolve Prism expressions and eval blocks that need to be converted to strings
        var search = /PRISMEXPRESSIONSTART\(/g
        var opens = new Array

        while (search.exec(this.text) !== null) {
            opens.push(search.lastIndex - 1)
        }

        opens.reverse()

        for (i = 0; i < opens.length; i++) {
            depth = 0
            for (j = opens[i]; j < this.text.length; j++) {
                // Look for a closer
                if (this.text.charAt(j) === "(") {
                    depth++
                }
                if (this.text.charAt(j) === ")") {
                    depth--
                }
                if (depth === 0) {
                    if (this.text.charAt(j) === ")") {
                        this.text = this.text.substring(0, opens[i] - 20) + this.text.substring(opens[i] + 1, j) + this.text.substring(j + 1, this.text.length)
                    }
                    break
                }
            }
        }

        search = /PRISMEVALBLOCKSTART\{/g
        opens = new Array

        while (search.exec(this.text) !== null) {
            opens.push(search.lastIndex - 1)
        }

        opens.reverse()

        for (i = 0; i < opens.length; i++) {
            depth = 0
            for (j = opens[i]; j < this.text.length; j++) {
                // Look for a closer
                if (this.text.charAt(j) === "{") {
                    depth++
                }
                if (this.text.charAt(j) === "}") {
                    depth--
                }
                if (depth === 0) {
                    if (this.text.charAt(j) === "}") {
                        this.text = this.text.substring(0, opens[i] - 19) + "\"" + treatMultilineString(this.text.substring(opens[i] + 1, j)) + "\"" + this.text.substring(j + 1, this.text.length)
                    }
                    break
                }
            }
        }

        function treatMultilineString(text) {
            if (arguments.length === 1 && typeof arguments[0] === "object" && arguments[0]._ === null) {
                text = "text" in arguments[0] ? arguments[0].text : ""
            } else {
                if (typeof text === "undefined") {
                    text = ""
                }
            }
            // If indenting on first line is nil but +1 on all other lines,
            // then reduce the other lines by the lower common amount
            if (text.match(/\n/) !== null) {
                var lines = text.split("\n")
                var indent = Infinity
                var lastIndentType
                var indentAgreement = true
                if (lines[0].match(/^ +/) === null) {
                    for (var i = 1; i < lines.length; i++) {
                        var trimmed = lines[i].replace(/^( +|\t+)[^\1][\s\S]*$/, "$1")
                        if (trimmed !== lines[i]) {
                            if (trimmed.charAt(0) !== lastIndentType && i > 1) {
                                indentAgreement = false
                                break
                            }
                            indent = Math.min(trimmed.length, indent)
                            lastIndentType = trimmed.charAt(0)
                        } else {
                            indent = 0
                        }
                    }
                }
                if (indent > 0 && indent < Infinity && indentAgreement === true) {
                    for (var i = 1; i < lines.length; i++) {
                        lines[i] = lines[i].substring(indent, lines[i].length)
                    }
                    text = lines.join("\n")
                }
            }
            text = text.replace(/([^\\])""/g, "$1\\\"\\\"")
            text = text.replace(/([^\\])"/g, "$1\\\"")
            text = text.replace(/^"/g, "\\\"")
            text = text.replace(/([^\\])(\n)/g, "$1\\n\\$2")
            text = text.replace(/^(\n)/gm, "\\n\\$1")
            return text
        }
    }
}).call(this, JS11.Compiler.prototype)

function sendResult(resultText) {
    if (typeof resultText === 'undefined' || resultText === null || !resultText.length) return;
    postMessage({
        'type': 'result',
        'resultText': resultText
    });
}
function sendError(errorText) {
    postMessage({
        'type': 'error',
        'errorText': errorText
    });
}
if (typeof window === "undefined" && typeof global === "undefined") {
    // Running as worker
    var compiler = new JS11.Compiler
    this.onmessage = function (event) {
        sendResult(compiler.toJS(event.data))
    }
}