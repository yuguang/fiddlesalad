importScripts('coffeescript.base.js?v=201302114');

function sendMappedResult(resultText, mapping) {
    if (typeof resultText === 'undefined' || resultText === null || !resultText.length) return;
    postMessage({
        'type': 'mappedResult',
        'resultText': resultText,
        'mappingJSON': mapping
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
var map;
self.addEventListener('message', function(e) {
    try {
        var output = CoffeeScript.compile(e.data, {bare: true, sourceMap: true});
        sendMappedResult(output.js, output.v3SourceMap);
    } catch (err) {
		if (err.name == 'SyntaxError') {
			sendError(err);
		}
    }
}, false);