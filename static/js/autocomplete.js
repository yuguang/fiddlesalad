var CompositeCodeComplete = Class.$extend({
    __init__: function () {
        this.hintComponents = [];
    },

    add: function (child) {
        this.hintComponents.push(child);
    },

    remove: function (child) {
        for (var i = 0, len = this.hintComponents.length; i < len; i++) {
            if (this.hintComponents[i] === child) {
                this.hintComponents.splice(i, 1);
                break;
            }
        }
    },

    getChild: function (i) {
        return this.hintComponents[i];
    },

    getCompletions: function (editor, lastChar) {
        var hints = [], token = editor.getTokenAt(editor.getCursor());
        for (var i = 0, len = this.hintComponents.length; i < len; i++) {
            hints.push(this.hintComponents[i].getCompletions(token.string + lastChar));
        }
        return _.flatten(hints);
    }
});

var Hint = Class.$extend({
    __init__: function (words) {
        this.trie = new Trie();
        if (words === undefined) return;
        for (var i = 0, len = words.length; i < len; i++) {
            this.trie.insert(words[i]);
        }
    },

    add: new Function, remove: new Function, getChild: new Function,

    getCompletions: function (prefix) {
        return this.trie.autoComplete(prefix);
    }
});

var CompositeMethodComplete = Class.$extend({
    __init__: function () {
        this.hintComponents = {};
    },

    add: function (child, key) {
        this.hintComponents[key] = child;
    },

    remove: function (key) {
        delete this.hintComponents[key];
    },

    getChild: function (key) {
        return this.hintComponents[key];
    },

    getCompletions: function (editor) {
        var cur = editor.getCursor(), token = editor.getTokenAt(cur), currToken = token;
        while (currToken.string.length && currToken.string != ' ') {
            if (!context) var context = [];
            context.unshift(currToken.string);
            currToken = editor.getTokenAt({line:cur.line, ch:currToken.start});
        }
//        console.log(context)
        // normalize keys
        // namespace() for functions and namespace for objects
        // namespace(argument).method -> namespace().method
        var key = context.join('').replace(/\(.*\)/, '()');
        // namespace.method -> namespace
        key = key.replace(/\.[\w]*/, '');
//        console.log(key)
        if (!this.hintComponents.hasOwnProperty(key)) return [];
        // remove everything before the . operator from the context
        return this.hintComponents[key].getCompletions(context.join('').replace(/.*\./, ''));
    }
});