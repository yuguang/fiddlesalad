importScripts('coffeescript.base.js');

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
self.addEventListener('message', function(e) {
    try {
        sendResult(CoffeeScript.compile(e.data, {bare: true}));
    } catch (err) {
		if (err.name == 'SyntaxError')
			sendError(err.message);
    }
}, false);