var _gaq = [
    ['_setAccount', 'UA-8796086-9'],
    ['_trackPageview']
];

var accordionOptions = { fillSpace: false, collapsible: true };

LANGUAGE = {
    PYTHON: 'python',
    OPAL: 'opal',
    JAVASCRIPT: 'javascript',
    COFFEESCRIPT: 'coffeescript',
    TYPESCRIPT: 'typescript',
    JSX: 'jsx',
    ROY: 'roy',
    COFFEEKUP: 'coffeekup',
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
    opal: LANGUAGE_TYPE.PROGRAM,
    javascript: LANGUAGE_TYPE.PROGRAM,
    coffeescript: LANGUAGE_TYPE.PROGRAM,
    typescript: LANGUAGE_TYPE.PROGRAM,
    jsx: LANGUAGE_TYPE.PROGRAM,
    roy: LANGUAGE_TYPE.PROGRAM,
    html: LANGUAGE_TYPE.DOCUMENT,
    haml: LANGUAGE_TYPE.DOCUMENT,
    jade: LANGUAGE_TYPE.DOCUMENT,
    coffeekup: LANGUAGE_TYPE.DOCUMENT,
    markdown: LANGUAGE_TYPE.DOCUMENT,
    css: LANGUAGE_TYPE.STYLE,
    less: LANGUAGE_TYPE.STYLE,
    sass: LANGUAGE_TYPE.STYLE,
    scss: LANGUAGE_TYPE.STYLE,
    stylus: LANGUAGE_TYPE.STYLE
};

COMPATIBLE_LANGUAGES = {
	CSS: [LANGUAGE.CSS, LANGUAGE.SCSS, LANGUAGE.LESS],
	HTML: [LANGUAGE.HTML],
	JAVASCRIPT: [LANGUAGE.JAVASCRIPT, LANGUAGE.TYPESCRIPT]
};

var notyDefaults = {"layout":"topRight","type":"alert","textAlign":"center","easing":"swing","animateOpen":{"height":"toggle"},"animateClose":{"height":"toggle"},"speed":"500","timeout":"5000","closable":true,"closeOnSelfClick":true};
