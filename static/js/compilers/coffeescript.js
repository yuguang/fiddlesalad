importScripts('coffeescript.base.js');

function sendResult(resultText) {
    if (typeof resultText === 'undefined' || resultText === null || !resultText.length) return;
    postMessage({
        'type': 'result',
        'resultText': resultText
    });
}
function sendError(error) {
	var line;
	if ('location' in error) { 
		line = error.location.first_line;
	} else if ('lineNumber' in error) {
		line = error.lineNumber;
	}
    postMessage({
        'type': 'error',
		'line': line,
        'errorText': error.message
    });
}
self.addEventListener('message', function(e) {
    try {
        sendResult(CoffeeScript.compile(e.data, {bare: true}));
    } catch (err) {
		if (err.name == 'SyntaxError') {
			sendError(err);
		}
    }
}, false);