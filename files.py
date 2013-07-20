import sys

command = sys.argv[1]
if command == 'syncmedia':
    build_config = True
else:
    build_config = False

if not build_config:
    FILES = {
        'BOWSER': 'js/bowser.js',
        'UNDERSCORE': 'js/underscore.js',
        'VALIDATE': 'js/jquery.validate.js',
        'KNOCKOUT': 'js/knockout-latest.debug.js',
        'KNOCKOUT_MAPPING': 'js/knockout.mapping.js',
        'PACKAGES': 'js/packages.fiddle.js',
        }
else:
    FILES = {
        'BOWSER': 'js/build/lib/bowser.min.js',
        'UNDERSCORE': 'js/build/lib/underscore.min.js',
        'VALIDATE': 'js/build/lib/jquery.validate.min.js',
        'KNOCKOUT': 'js/build/lib/knockout.min.js',
        'KNOCKOUT_MAPPING': 'js/build/lib/knockout.mapping.min.js',
        'PACKAGES': 'js/build/packages.fiddle.js',
        }

MEDIASYNC_JOINED = {
        'css/boilerplate.css': [
            'css/boilerplate.css'
        ],
        'css/documentation.css': [
            'css/documentation.css',
            'css/syntax_highlighter_theme_default.css',
        ],
        'css/wijmo-artisto.css': [
            'css/jquery-ui.artisto.css',
            'css/jquery.wijmo-open.css',
            ],
        'css/home.css': [
            'css/bootstrap.css',
            'css/codemirror.css',
            'css/codemirror/themes/monokai.css',
            'css/home.css',
            'css/logo.fiddlesalad.css',
            ],
        'css/snippets.css': [
            'css/user.css'
        ],
        'css/login.css': [
            'css/login.css'
        ],
        'css/404.css': [
            'css/404.css'
        ],
        'css/styles.fiddle.css': [
            'css/jquery-ui.flick.css',
            'css/jquery.wijmo-open.css',
            'css/jquery.noty.css',
            'css/noty_theme_default.css',
            'css/boilerplate.css',
            'css/codemirror.css',
            'css/codemirror/themes/stylish.css',
            'css/codemirror/util/dialog.css',
            'css/codemirror/util/lint.css',
            'css/show-hint.css',
            'css/mergely.css',
            'css/style.css',
            'css/logo.fiddlesalad.css',
            'css/fiddle.css',
            'css/faq.css'
        ],
        'js/navigation.js': [
            'js/navigation.js'
        ],
        'js/documentation.js': [
            'js/build/lib/shCore.js',
            'js/build/lib/shAutoloader.js',
            'js/build/lib/shBrushPython.js',
            'js/build/lib/shBrushXml.js',
            'js/build/lib/shBrushCoffeeScript.js',
        ],
        'js/jquery-ui.fiddle.js': [
            'js/jquery-ui-1.8.18.custom.js',
            'js/jquery.wijmo-open.all.2.0.0.min.js',
            ],
        'js/knockout.js': [
            FILES['VALIDATE'],
            'js/additional-methods.js',
            FILES['KNOCKOUT'],
            'js/knockout-jquery-ui-widget.js',
            FILES['KNOCKOUT_MAPPING'],
            'js/bindings.js',
            ],
        'js/fiddle.bootstrap.js': [
            FILES['BOWSER'],
            FILES['UNDERSCORE'],
            'js/build/lib/sugar.min.js',
            'js/classy.js',
            'js/helpers.js',
            'js/trie.js',
            'js/autocomplete.js',
            'js/store.js',
            'js/base64.js',
            'js/frameworks.js',
            'js/compiled-coffee/codestorage.js',
            'js/fiddle-configuration.js',
            'js/keywords.js',
            'js/compiled-coffee/keylistener.js',
            'js/compiled-coffee/engine.require.js',
            'js/compiled-coffee/user-interface.js',
            'js/compiled-coffee/fiddle-engine.js',
            ],
        'js/codemirror.fiddle.js': [
            'js/codemirror.js',
            'js/codemirror/show-hint.js',
            'js/codemirror/javascript-hint.js',
            'js/codemirror/python-hint.js',
            'js/codemirror/html-hint.js',
            'js/codemirror/dialog.js',
            'js/codemirror/searchcursor.js',
            'js/codemirror/search.js',
            'js/codemirror/active-line.js',
            'js/codemirror/formatting.js',
            'js/codemirror/match-highlighter.js',
            'js/keywords.js',
            'js/codemirror/lint.js',
            'js/codemirror/closetag.js',
            'js/codemirror/closebrackets.js',
            'js/codemirror/mode/python/python.js',
            'js/codemirror/mode/javascript/javascript.js',
            'js/codemirror/mode/coffeescript/coffeescript.js',
            'js/codemirror/mode/css/css.js',
            'js/build/lib/emmet.min.js',
            'js/codemirror/mode/xml/xml.js',
            'js/codemirror/mode/htmlmixed/htmlmixed.js',
            'js/codemirror/mode/ruby/ruby.js',
            'js/codemirror/mode/haml/haml.js',
            'js/codemirror/multiplex.js',
            'js/codemirror/mode/jade/jade.js',
            'js/codemirror/mode/less/less.js',
            'js/codemirror/mode/sass/sass.js',
            'js/codemirror/mode/roy/roy.js',
            'js/codemirror/mode/markdown/markdown.js',
            'js/codemirror/mode/stylus/stylus.js',
            'js/codemirror/runmode.js',
            ],
        'js/fiddle.plugins.js': [
            'js/jquery.csrf.js',
            'js/jquery.history.js',
            'js/mergely.js',
            ],
        'js/fiddle.init.js': [
            'js/prefixfree.js',
            'js/date.format.js',
            'js/compiled-coffee/model.js',
            'js/fiddle.js',
            'js/layout.js',
            FILES['PACKAGES'],
            'js/htmlparser.js',
            'js/jade.runtime.min.js',
            'js/jquery.noty.js',
            'js/beautify.js',
            ],
        'js/menu.fiddle.js': [
            'js/bootstrap.js',
            'js/fiddle-configuration.js',
            'js/keywords.js',
            'js/queue.js',
            'js/store.js',
            'js/classy.js',
            'js/compiled-coffee/codestorage.js',
            'js/compiled-coffee/menu.js',
            ]
    }

if build_config:
    MEDIASYNC_JOINED['js/jquery-ui.fiddle.js'] = [
        'js/build/lib/jquery-ui-1.8.19.custom.min.js',
        'js/build/lib/jquery.wijmo.wijutil.min.js',
        'js/build/lib/jquery.wijmo.wijdialog.min.js',
        'js/build/lib/jquery.wijmo.wijsplitter.min.js',
        'js/build/lib/jquery.wijmo.wijmenu.min.js',
        'js/build/lib/jquery.wijmo.wijaccordion.min.js',
        ]