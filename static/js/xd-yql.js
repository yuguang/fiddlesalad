function makeCallback(callback) {
    return function (data) {
        // If we have something to work with...
        if (data.results[0]) {
            // Strip out all script tags, for security reasons.
            // BE VERY CAREFUL. This helps, but we should do more.
            data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

            // If the user passed a callback, and it
            // is a function, call it, and send through the data var.
            if (typeof callback === 'function') {
                return callback(data);
            }
        }
        // Else, Maybe we requested a site that doesn't exist, and nothing returned.
        else throw new Error('Nothing returned from getScript.');
    };
}

// Accepts a url and a callback function to run.


function requestCrossDomain(site) {

    // If no url was passed, exit.
    if (!site) {
        alert('No site was passed.');
        return false;
    }

    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=cbFunc';

    // Request that YSQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getScript(yql);
}

function scrapePythonCode(html) {
    var code = '';
    var i = 0;
    var codeSections = ['pre', '.python', '.syntaxhighlighter'];
    while (!code.length && i < codeSections.length) {
        code = $(codeSections[i++], html).text();
    }
    if (!code.length) {
        viewModel.output('No Python code blocks were found!');
    }
    function convertToAscii(str) {
        return str.replace(/[^A-Za-z 0-9 \.,\?'""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~\n]*/g, '');
    }
    engine.set_code(convertToAscii(code));
}

function scrapeStackoverflowQuestion(html) {
    viewModel.title($.trim($('#question-header h1', html).text()));
    viewModel.description($('#question', html).find('.post-text p').text());

    var tags = new Array;
    $('#question', html).find('.post-taglist a').each(function () {
        tags.push($(this).text());
    });
    viewModel.tags(tags.join(', '));
}

var cbFunc = makeCallback(scrapeStackoverflowQuestion);