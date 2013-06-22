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

    getCompletions: function (start) {
        var hints = [];
        for (var i = 0, len = this.hintComponents.length; i < len; i++) {
            hints.push(this.hintComponents[i].getCompletions(start));
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