var _gaq = [
    ['_setAccount', 'UA-8796086-9'],
    ['_trackPageview']
];

var defaultShare = {
    'service':'sharethis',
    'element':document.getElementById('share_this'),
    'url':document.URL,
    'title':'fiddle salad',
    'type':'chicklet',
    'text':'ShareThis'
};

var accordionOptions = { fillSpace: false };

LANGUAGE = {
    PYTHON: 'python',
    JAVASCRIPT: 'javascript',
    COFFEESCRIPT: 'coffeescript',
    ROY: 'roy',
    COFFEECUP: 'coffeecup',
    LESS: 'less',
    CSS: 'css',
    HTML: 'html',
    RESOURCE: 'resource',
    SCSS: 'scss',
    SASS: 'sass',
    HAML: 'haml',
    STYLUS: 'stylus',
    JADE: 'jade',
    MARKDOWN: 'markdown',
    ZENCODING: 'zencoding',
    FRAMEWORK: 'framework'
};
LANGUAGE_TYPE = {
    STYLE: 1,
    DOCUMENT: 2,
    RESOURCE: 3,
    COMPILED_PROGRAM: 4,
    PROGRAM: 5,
    COMPILED_DOCUMENT: 6,
    COMPILED_STYLE: 7,
    FRAMEWORK: 8
};

LANGUAGE_CATEGORY = {
    python: LANGUAGE_TYPE.PROGRAM,
    javascript: LANGUAGE_TYPE.PROGRAM,
    coffeescript: LANGUAGE_TYPE.PROGRAM,
    roy: LANGUAGE_TYPE.PROGRAM,
    html: LANGUAGE_TYPE.DOCUMENT,
    haml: LANGUAGE_TYPE.DOCUMENT,
    jade: LANGUAGE_TYPE.DOCUMENT,
    coffeecup: LANGUAGE_TYPE.DOCUMENT,
    markdown: LANGUAGE_TYPE.DOCUMENT,
    zencoding: LANGUAGE_TYPE.DOCUMENT,
    css: LANGUAGE_TYPE.STYLE,
    less: LANGUAGE_TYPE.STYLE,
    sass: LANGUAGE_TYPE.STYLE,
    scss: LANGUAGE_TYPE.STYLE,
    stylus: LANGUAGE_TYPE.STYLE
};

COMPATIBLE_LANGUAGES = {
	CSS: [LANGUAGE.CSS, LANGUAGE.SCSS, LANGUAGE.LESS],
	HTML: [LANGUAGE.ZENCODING, LANGUAGE.HTML],
	JAVASCRIPT: [LANGUAGE.JAVASCRIPT]
};

var notyDefaults = {"layout":"topRight","type":"alert","textAlign":"center","easing":"swing","animateOpen":{"height":"toggle"},"animateClose":{"height":"toggle"},"speed":"500","timeout":"5000","closable":true,"closeOnSelfClick":true};
