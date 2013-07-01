importScripts('coffeescript.base.js');

function sendResult(resultText) {
    if (typeof resultText === 'undefined' || resultText === null || !resultText.length) return;
    postMessage({
        'type': 'result',
        'resultText': resultText
    });
}
function sendError(errorText, line) {
    postMessage({
        'type': 'error',
		'line': line,
        'errorText': errorText
    });
}
self.addEventListener('message', function(e) {
    try {
        sendResult(CoffeeScript.compile(e.data, {bare: true}));
    } catch (err) {
		if (err.name == 'SyntaxError') {
			var line;
			if ('location' in err) { 
				line = err.location.first_line;
			} else if ('lineNumber' in err) {
				line = err.lineNumber;
			}
			sendError(err.message, line);
		}
    }
}, false);