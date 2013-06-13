var autocompleteSelect;
(function () {
    CodeMirror.simpleHint = function (editor, getHints, immediate, selectFirst) {
        // We want a single cursor position.
        if (editor.somethingSelected()) return;
        var result = getHints();

        function removeOldComplete() {
            var oldComplete = document.getElementsByClassName("CodeMirror-completions")[0];
            oldComplete.parentNode.removeChild(oldComplete);
        }

        if (!result || !result.list.length) {
            _.defer(function(){
                if (document.getElementsByClassName("CodeMirror-completions").length) {
                    removeOldComplete();
                }
            });
            throw CodeMirror.Pass;
        }
        var completions = result.list;

        function insert(str) {
            editor.replaceRange(str, result.from, result.to);
        }

        // When there is only one completion, use it directly.
        if (selectFirst || (immediate && completions.length == 1)) {
            insert(completions[0]);
            if (selectFirst) {
                removeOldComplete();
            }
            return true;
        } else if (document.getElementsByClassName("CodeMirror-completions").length) {
            removeOldComplete();
        }

        // Build the select widget
        var complete = document.createElement("div");
        complete.className = "CodeMirror-completions";
        autocompleteSelect = complete.appendChild(document.createElement("select"));
        // Opera doesn't move the selection when pressing up/down in a
        // multi-select, but it does properly support the size property on
        // single-selects, so no multi-select is necessary.
        if (!window.opera) autocompleteSelect.multiple = true;
        for (var i = 0; i < completions.length; ++i) {
            var opt = autocompleteSelect.appendChild(document.createElement("option"));
            opt.appendChild(document.createTextNode(completions[i]));
        }
        autocompleteSelect.firstChild.selected = true;
        autocompleteSelect.size = Math.min(10, completions.length);
        var pos = editor.cursorCoords();
        complete.style.left = pos.x + "px";
        complete.style.top = pos.yBot + "px";
        document.body.appendChild(complete);
        // Hack to hide the scrollbar.
        if (completions.length <= 10)
            complete.style.width = (autocompleteSelect.clientWidth - 1) + "px";

        var done = false;

        function close() {
            if (done) return;
            done = true;
            complete.parentNode.removeChild(complete);
        }

        function pick() {
            insert(completions[autocompleteSelect.selectedIndex]);
            close();
            setTimeout(function () {
                editor.focus();
            }, 50);
        }

        CodeMirror.connect(autocompleteSelect, "blur", close);

        CodeMirror.connect(autocompleteSelect, "keydown", function (event) {
            var code = event.keyCode;
            // Enter or Tab
            if (code == 13 || code == 9) {
                CodeMirror.e_stop(event);
                pick();
            }
            // Escape
            else if (code == 27) {
                CodeMirror.e_stop(event);
                close();
                editor.focus();
            }
            // Up and Down
            else if (code != 38 && code != 40) {
                close();
                editor.focus();
                setTimeout(function () {
                    CodeMirror.simpleHint(editor, getHints, true);
                }, 50);
            }
        });
        CodeMirror.connect(autocompleteSelect, "dblclick", pick);

        if (immediate) {
            autocompleteSelect.focus();
        } else {
            editor.focus();
        }

        // Opera sometimes ignores focusing a freshly created node
        if (window.opera) setTimeout(function () {
            if (!done) autocompleteSelect.focus();
        }, 100);
        return true;
    };
})();
