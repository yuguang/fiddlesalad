(function(){

    var packages = [
        {
            "name":"ace",
            "filename":"ace.js",
            "version":"0.2.0",
            "description":"Ace is a standalone code editor written in JavaScript.",
            "homepage":"http://ace.ajax.org/",
            "keywords":[
                "code",
                "editor"
            ],
            "maintainers":[
                {
                    "name":"The Ace Project"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/ajaxorg/ace/"
                }
            ]
        }
        ,
        {
            "name":"augment.js",
            "filename":"augment.min.js",
            "version":"0.4.0",
            "description":"Enables use of modern JavaScript by augmenting built in objects with the latest JavaScript methods.",
            "homepage":"http://augmentjs.com",
            "keywords":[
                "es5",
                "ECMAScript 5",
                "shim",
                "compatibility",
                "modernization"
            ],
            "maintainers":[
                {
                    "name":"Oliver Nightingale",
                    "email":"oliver.nightingale1@gmail.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/olivernn/augment.js"
                }
            ]
        }
        ,
        {
            "name":"backbone-localstorage.js",
            "filename":"backbone.localStorage-min.js",
            "version":"1.0",
            "description":"A simple module to replace Backbone.sync with localStorage-based persistence. Models are given GUIDS, and saved into a JSON object. Simple as that.",
            "homepage":"https://github.com/jeromegn/Backbone.localStorage",
            "keywords":[
                "localstorage",
                "backbone"
            ],
            "maintainers":[
                {
                    "name":"Jerome Gravel-Niquet",
                    "email":"jeromegn@gmail.com",
                    "web":"http://jgn.me/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jeromegn/Backbone.localStorage"
                }
            ]

        }
        ,
        {
            "name":"backbone.js",
            "filename":"backbone-min.js",
            "version":"0.9.2",
            "description":"Backbone supplies structure to JavaScript-heavy applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing application over a RESTful JSON interface.",
            "homepage":"http://documentcloud.github.com/backbone/",
            "keywords":[
                "collections",
                "models",
                "controllers",
                "events",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Jeremy Ashkenas",
                    "email":"jashkenas@gmail.com",
                    "web":"http://ashkenas.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/documentcloud/backbone"
                }
            ]

        }
        ,
        {
            "name":"benchmark",
            "version":"0.3.0",
            "filename":"benchmark.min.js",
            "description":"A benchmarking library that works on nearly all JavaScript platforms, supports high-resolution timers, and returns statistically significant results.",
            "homepage":"http://benchmarkjs.com/",
            "main":"benchmark",
            "keywords":[
                "benchmark",
                "node",
                "narwhal",
                "performance",
                "ringo",
                "speed"
            ],
            "licenses":[
                {
                    "type":"MIT",
                    "url":"http://mths.be/mit"
                }
            ],
            "author":{
                "name":"Mathias Bynens",
                "email":"mathias@benchmarkjs.com",
                "web":"http://mathiasbynens.be/"
            },
            "maintainers":[
                {
                    "name":"John-David Dalton",
                    "email":"john@fusejs.com",
                    "web":"http://allyoucanleet.com/"
                },
                {
                    "name":"Mathias Bynens",
                    "email":"mathias@benchmarkjs.com",
                    "web":"http://mathiasbynens.be/"
                }
            ],
            "bugs":{
                "email":"bugs@benchmarkjs.com",
                "url":"https://github.com/bestiejs/benchmark.js/issues"
            },
            "repository":{
                "type":"git",
                "url":"https://github.com/bestiejs/benchmark.js.git"
            },
            "engines":[
                "node",
                "rhino"
            ],
            "directories":{
                "doc":"docs",
                "test":"tests"
            }
        },
        {
            "name":"camanjs",
            "filename":"caman.full.min.js",
            "version":"3.1.1",
            "description":"Pure Javascript (Ca)nvas (Man)ipulation.",
            "homepage":"http://camanjs.com/",
            "keywords":[
                "html5",
                "canvas",
                "image",
                "filter",
                "manipulate",
                "pixel",
                "effects"
            ],
            "maintainers":[
                {
                    "name":"Ryan LeFevre",
                    "website":"http://meltingice.net"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/meltingice/CamanJS"
                }
            ]

        }
        ,
        {
            "name":"chrome-frame",
            "filename":"CFInstall.min.js",
            "version":"1.0.2",
            "description":"Google Chrome Frame is an open source plug-in that seamlessly brings Google Chrome's open web technologies and speedy JavaScript engine to Internet Explorer.",
            "homepage":"http://code.google.com/chrome/chromeframe/",
            "keywords":[
                "plugin",
                "plug-in",
                "chrome",
                "frame"
            ],
            "maintainers":[
                {
                    "name":"Google"
                }
            ]
        }
        ,
        {
            "name":"coffee-script",
            "filename":"coffee-script.min.js",
            "version":"1.3.1",
            "description":"CoffeeScript is a little language that compiles into JavaScript. Underneath all of those embarrassing braces and semicolons, JavaScript has always had a gorgeous object model at its heart. CoffeeScript is an attempt to expose the good parts of JavaScript in a simple way.",
            "homepage":"http://jashkenas.github.com/coffee-script/",
            "keywords":[
                "coffeescript",
                "compiler",
                "language",
                "coffee",
                "script",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Jeremy Ashkenas",
                    "email":"jashkenas@gmail.com",
                    "web":"http://ashkenas.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jashkenas/coffee-script.git"
                }
            ]

        }
        ,
        {
            "name":"css3finalize",
            "filename":"jquery.css3finalize.min.js",
            "version":"2.1",
            "description":"Skip vendor prefixes",
            "homepage":"https://github.com/codler/jQuery-Css3-Finalize",
            "keywords":[
                "css",
                "css3"
            ],
            "maintainers":[
                {
                    "name":"Han Lin Yap",
                    "web":"http://zencodez.net/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/codler/jQuery-Css3-Finalize"
                }
            ]

        }
        ,
        {
            "name":"css3pie",
            "version":"1.0beta5",
            "filename":"PIE.js",
            "homepage":"http://css3pie.com",
            "description":"CSS3 PIE JavaScript edition. Enables rendering of common CSS3 decoration properties in Internet Explorer 6-9.",
            "keywords":[
                "polyfill",
                "css3",
                "ie"
            ],
            "maintainers":[
                {
                    "name":"Jason Johnston",
                    "email":"jason@css3pie.com",
                    "web":"http://lojjic.com"
                }
            ],
            "bugs":{
                "web":"https://github.com/lojjic/PIE/issues/"
            },
            "licenses":[
                {
                    "type":"Apache-2.0",
                    "url":"https://github.com/lojjic/PIE/blob/master/LICENSE-APACHE2.txt"
                },
                {
                    "type":"GPL-2.0",
                    "url":"https://github.com/lojjic/PIE/blob/master/LICENSE-GPL2.txt"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"git@github.com:lojjic/PIE.git"
                }
            ]
        },
        {
            "name":"cufon",
            "filename":"cufon-yui.js",
            "version":"1.09i",
            "description":"Fast text replacement with canvas and VML - no Flash or images required.",
            "homepage":"http://cufon.shoqolate.com/",
            "keywords":[
                "font",
                "canvas",
                "vml",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Simo Kinnunen",
                    "web":"https://twitter.com/sorccu"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/sorccu/cufon/"
                }
            ]
        }
        ,
        {
            "name":"d3",
            "filename":"d3.v2.min.js",
            "version":"2.8.1",
            "description":"A small, free JavaScript library for manipulating documents based on data.",
            "keywords":[
                "dom",
                "w3c",
                "visualization",
                "svg",
                "animation",
                "canvas"
            ],
            "homepage":"http://mbostock.github.com/d3/",
            "author":{
                "name":"Mike Bostock",
                "email":"mbostock@gmail.com",
                "url":"http://bost.ocks.org/mike"
            },
            "repository":{
                "type":"git",
                "url":"http://github.com/mbostock/d3.git"
            }
        }
        ,
        {
            "name":"datejs",
            "filename":"date.min.js",
            "version":"1.0",
            "description":"Datejs is an open source JavaScript Date library for parsing, formatting and processing.",
            "homepage":"http://www.datejs.com",
            "keywords":[
                "date",
                "datetime",
                "time",
                "parser"
            ],
            "maintainers":[
                {
                    "name":"Geoffrey Mcgill",
                    "email":"geoff@geoff.ca",
                    "twitter":"datejs"
                }
            ],
            "repositories":[
                {
                    "type":"Google SVN",
                    "url":"http://code.google.com/p/datejs/source"
                },
                {
                    "type":"git",
                    "url":"https://github.com/datejs/Datejs"
                }
            ]

        },
        {
            "name":"davis.js",
            "filename":"davis.min.js",
            "version":"0.7.0",
            "description":"Davis.js is a small JavaScript library using HTML5 history.pushState that allows simple Sinatra style routing for your JavaScript apps.",
            "homepage":"http://davisjs.com",
            "keywords":[
                "routing",
                "pushState",
                "restful"
            ],
            "maintainers":[
                {
                    "name":"Oliver Nightingale",
                    "email":"oliver.nightingale1@gmail.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/olivernn/davis.js"
                }
            ]
        }
        ,
        {
            "name":"dd_belatedpng",
            "filename":"dd_belatedpng.min.js",
            "version":"0.0.8",
            "description":"Allows the use of transparent PNGs in images and CSS backgrounds in IE6.",
            "homepage":"http://www.dillerdesign.com/experiment/DD_belatedPNG/",
            "keywords":[
                "ie6",
                "png"
            ],
            "maintainers":[
                {
                    "name":"Drew Diller",
                    "web":"https://www.dillerdesign.com/"
                }
            ],
            "repositories":[
            ]
        }
        ,
        {
            "author":"Jerome Gravel-Niquet <jeromegn@gmail.com> (http://jgn.me)",
            "name":"documentup",
            "description":"Pretty documentation generator for Github projects with proper Readme.",
            "version":"0.1.1",
            "homepage":"http://documentup.com",
            "repository":{
                "type":"git",
                "url":"git://github.com/jeromegn/documentup.git"
            },
            "engines":{
                "node":"~0.6.1"
            },
            "filename":"documentup.min.js",
            "dependencies":{},
            "devDependencies":{
                "coffee-script":"~1.1.0",
                "stylus":"0.22.6",
                "nib":"0.3.2",
                "uglify-js":"1.2.5",
                "ender":"0.8.3",
                "async":"0.1.15"
            }
        }
        ,
        {
            "name":"dojo",
            "filename":"dojo.xd.js",
            "version":"1.6.0",
            "description":"Dojo saves you time, delivers powerful performance, and scales with your development process. It’s the toolkit experienced developers turn to for building superior desktop and mobile web experiences.",
            "homepage":"http://dojotoolkit.org/",
            "keywords":[
                "framework",
                "toolkit",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"The Dojo Foundation"
                }
            ]
        }
        ,
        {
            "name":"dygraphs",
            "filename":"dygraph-combined.js",
            "version":"1.2",
            "description":"dygraphs is an open source JavaScript library that produces produces interactive, zoomable charts of time series. It is designed to display dense data sets and enable users to explore and interpret them.",
            "homepage":"http://dygraphs.com/",
            "keywords":[
                "graphs",
                "charts",
                "interactive"
            ],
            "maintainers":[
                {
                    "name":"Dan Vanderkam"
                }
            ]
        }
        ,
        {
            "name":"ember.js",
            "filename":"ember-0.9.4.min.js",
            "version":"0.9.4",
            "description":"Ember is a JavaScript framework for creating ambitious web applications that eliminates boilerplate and provides a standard application architecture.",
            "homepage":"http://emberjs.com/",
            "keywords":[
                "ember",
                "ember.js"
            ],
            "maintainers":[
                {
                    "name":"Ember.js",
                    "web":"http://emberjs.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/emberjs/ember.js"
                }
            ]

        }
        ,
        {
            "name":"es5-shim",
            "filename":"es5-shim.min.js",
            "version":"1.2.4",
            "description":"Provides compatibility shims so that legacy JavaScript engines behave as closely as possible to ES5.",
            "homepage":"https://github.com/kriskowal/es5-shim",
            "keywords":[
                "es5",
                "ECMAScript 5",
                "shim",
                "compatibility",
                "modernization"
            ],
            "maintainers":[
                {
                    "name":"Kristopher Michael Kowal",
                    "email":"rfobic@gmail.com",
                    "web":"http://jeditoolkit.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/kriskowal/es5-shim"
                }
            ]

        }
        ,
        {
            "name":"ext-core",
            "filename":"ext-core.js",
            "version":"3.1.0",
            "description":"Ext JS is the developer's choice for building powerful desktop web applications using JavaScript and web standards.",
            "homepage":"http://www.sencha.com/products/extjs/",
            "keywords":[
                "framework",
                "toolkit",
                "desktop",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Sencha"
                }
            ]
        }
        ,
        {
            "name":"fancybox",
            "filename":"jquery.fancybox.pack.js",
            "version":"2.0.5",
            "description":"fancyBox is a tool that offers a nice and elegant way to add zooming functionality for images, html content and multi-media on your webpages. It is built at the top of the popular JavaScript framework jQuery and is both easy to implement and a snap to customize.",
            "homepage":"http://fancyapps.com/fancybox/",
            "keywords":[
                "fancybox",
                "jquery",
                "images",
                "image",
                "zoom",
                "zooming"
            ],
            "maintainers":[
                {
                    "name":"Janis Skarnelis",
                    "web":"http://fancyapps.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/fancyapps/fancyBox"
                }
            ]
        }
        ,
        {
            "name":"flexie",
            "filename":"flexie.min.js",
            "version":"1.0.0",
            "description":"Cross-browser support for the CSS3 Flexible Box Model.",
            "homepage":"http://flexiejs.com/",
            "keywords":[
                "css",
                "css3",
                "flexible",
                "box",
                "model",
                "polyfill",
                "flexbox"
            ],
            "maintainers":[
                {
                    "name":"Richard Herrera"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/doctyper/flexie"
                }
            ]

        }
        ,
        {
            "name":"flot",
            "filename":"jquery.flot.min.js",
            "version":"0.7",
            "description":"Attractive Javascript plotting for jQuery",
            "homepage":"http://code.google.com/p/flot/",
            "keywords":[
                "jquery",
                "plot",
                "chart",
                "graph",
                "visualization",
                "canvas",
                "graphics",
                "web"
            ],
            "maintainers":[
                {
                    "name":"Ole Laursen"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/flot/flot"
                }
            ]

        }
        ,
        {
            "name":"galleria",
            "filename":"galleria.min.js",
            "version":"1.2.6",
            "description":"The JavaScript Image Gallery.",
            "homepage":"http://galleria.aino.se",
            "keywords":[
                "gallery",
                "framework",
                "jquery",
                "slideshow",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Aino",
                    "website":"http://aino.se"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/aino/galleria"
                }
            ]
        }
        ,
        {
            "name":"graphael",
            "filename":"g.raphael-min.js",
            "version":"0.4.1",
            "description":"gRaphael's goal is to help you create stunning charts on your website. It is based on Raphaël graphics library.",
            "homepage":"http://g.raphaeljs.com/",
            "keywords":[
                "chart",
                "charts",
                "charting",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Dmitry Baranovskiy",
                    "web":"http://dmitry.baranovskiy.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/DmitryBaranovskiy/g.raphael/"
                }
            ]

        }
        ,
        {
            "name":"handlebars.js",
            "filename":"handlebars.min.js",
            "version":"1.0.0.beta2",
            "description":"Handlebars provides the power necessary to let you build semantic templates effectively with no frustration. Mustache templates are compatible with Handlebars, so you can take a Mustache template, import it into Handlebars, and start taking advantage of the extra Handlebars features.",
            "homepage":"http://www.handlebarsjs.com",
            "keywords":[
                "template",
                "mustache"
            ],
            "maintainers":[
                {
                    "name":"Yehuda Katz",
                    "web":"http://www.yehudakatz.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/wycats/handlebars.js"
                }
            ]

        },
        {
            "name":"hashgrid",
            "filename":"hashgrid.js",
            "version":"6",
            "description":"A little tool that inserts a layout grid in web pages, allows you to hold it in place, and toggle between displaying it in the foreground or background.",
            "homepage":"http://hashgrid.com/",
            "keywords":[
                "grid",
                "layout",
                "design",
                "columns"
            ],
            "maintainers":[
                {
                    "name":"Analog Coop",
                    "email":"hello@analog.coop",
                    "web":"http://analog.coop/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/dotjay/hashgrid"
                }
            ]
        }
        ,
        {
            "name":"headjs",
            "filename":"head.min.js",
            "version":"0.96",
            "description":"Load scripts like images. Use HTML5 and CSS3 safely. Target CSS for different screens, paths, states and browsers. Make it the only script in your HEAD. A concise solution to universal issues.",
            "homepage":"http://headjs.com/",
            "keywords":[
                "loader"
            ],
            "maintainers":[
                {
                    "name":"Tero Piirainen",
                    "web":"http://cloudpanic.com/about.html"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/headjs/headjs"
                }
            ]

        }
        ,
        {
            "name":"highcharts",
            "filename":"highcharts.js",
            "version":"2.2.1",
            "description":"Highcharts is a charting library written in pure JavaScript, offering an easy way of adding interactive charts to your web site or web application. Highcharts currently supports line, spline, area, areaspline, column, bar, pie and scatter chart types. Highcharts is NOT free for commercial use.  See the license here: http://highcharts.com/license",
            "homepage":"http://highcharts.com/",
            "keywords":[
                "charts",
                "graphs"
            ],
            "maintainers":[
                {
                    "name":"Torstein Hønsi (Highslide Software)",
                    "web":"http://highsoft.com/"
                }
            ]
        }
        ,
        {
            "name":"History.js",
            "filename":"native.history.js",
            "version":"1.7.1",
            "description":"Provides a cross-compatible experience for the History API on all HTML5 Browsers and backwards-compatible one on older ones using a hash-fallback.",
            "homepage":"https://github.com/balupton/History.js/",
            "keywords":[
                "history",
                "state",
                "html5",
                "onhashchange"
            ],
            "maintainers":[
                {
                    "name":"Benjamin Arthur Lupton",
                    "web":"http://lupton.cc"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/balupton/history.js.git"
                }
            ]

        }
        ,
        {
            "name":"hogan.js",
            "filename":"hogan.js",
            "version":"2.0.0",
            "description":"A mustache compiler.",
            "homepage":"http://twitter.github.com/hogan.js/",
            "keywords":["mustache", "template"],
            "author":"Twitter Inc.",
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/twitter/hogan.js.git"
                }
            ]
        },
        {
            "name":"html5shiv",
            "filename":"html5.js",
            "version":"r29",
            "description":"html5shiv is an HTML5 JavaScript shim for IE to recognise and style the HTML5 elements",
            "homepage":"http://code.google.com/p/html5shiv/",
            "keywords":[
                "shim",
                "ie",
                "html5"
            ],
            "maintainers":[
                {
                    "name":"Remy Sharp",
                    "email":"remysharp@gmail.com"
                }
            ],
            "repositories":[
                {
                    "type":"svn",
                    "url":"http://html5shiv.googlecode.com/svn/trunk/"
                }
            ]
        }
        ,
        {
            "name":"ICanHaz.js",
            "filename":"ICanHaz.min.js",
            "version":"0.9",
            "description":"A clean solution for templating with Mustache.js and jQuery or Zepto",
            "homepage":"http://icanhazjs.com",
            "keywords":[
                "templating",
                "mustache",
                "jquery",
                "zepto"
            ],
            "maintainers":[
                {
                    "name":"&yet",
                    "email":"contact@andyet.net",
                    "web":"http://andyet.net"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/andyet/ICanHaz.js"
                }
            ]
        }
        ,
        {
            "name":"javascript-state-machine",
            "filename":"state-machine.min.js",
            "version":"2.0.0",
            "description":"A finite state machine javascript micro framework.",
            "homepage":"https://github.com/jakesgordon/javascript-state-machine",
            "keywords":[
                "state-machine",
                "fsm"
            ],
            "maintainers":[
                {
                    "name":"Jake S. Gordon"
                }
            ]
        }
        ,
        {
            "name":"jquery",
            "filename":"jquery.min.js",
            "version":"1.7.2",
            "description":"jQuery is a fast and concise JavaScript Library that simplifies HTML document traversing, event handling, animating, and Ajax interactions for rapid web development. jQuery is designed to change the way that you write JavaScript.",
            "homepage":"http://jquery.com/",
            "keywords":[
                "framework",
                "toolkit",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"The jQuery Project"
                }
            ]
        }
        ,
        {
            "name":"jquery-easing",
            "filename":"jquery.easing.min.js",
            "version":"1.3",
            "description":"Additional easings for jQuery.",
            "homepage":"http://gsgd.co.uk/sandbox/jquery/easing/",
            "keywords":[
                "jquery",
                "easing"
            ],
            "maintainers":[
                {
                    "name":"George Smith",
                    "web":"http://gsgd.co.uk"
                }
            ],
            "repositories":[
                {
                    "type":"plain file",
                    "url":"http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js"
                }
            ]

        }
        ,
        {
            "name":"jquery-infinitescroll",
            "filename":"jquery.infinitescroll.min.js",
            "version":"2.0b2.110713",
            "description":"This plugin aims to progressively enhance your page, providing a more rich browsing experience when scrolling big amount of data.",
            "homepage":"http://www.infinite-scroll.com/infinite-scroll-jquery-plugin/",
            "keywords":[
                "jquery",
                "scroll",
                "infinite",
                "masonry"
            ],
            "maintainers":[
                {
                    "name":"Luke Shumard",
                    "web":"http://www.lukeshumard.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/paulirish/infinitescroll.git"
                }
            ]
        }
        ,
        {
            "name":"jquery-throttle-debounce",
            "filename":"jquery.ba-throttle-debounce.min.js",
            "version":"1.1",
            "description":"jQuery throttle / debounce allows you to rate-limit your functions in multiple useful ways.",
            "homepage":"https://github.com/cowboy/jquery-throttle-debounce",
            "keywords":[
                "jquery",
                "throttle",
                "debounce",
                "ratelimit"
            ],
            "maintainers":[
                {
                    "name":"Ben Alman",
                    "web":"http://benalman.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/cowboy/jquery-throttle-debounce.git"
                }
            ]
        }
        ,
        {
            "name":"jquery-timeago",
            "filename":"jquery.timeago.js",
            "version":"0.9.3",
            "description":"Timeago is a jQuery plugin that makes it easy to support automatically updating fuzzy timestamps (e.g. '4 minutes ago' or 'about 1 day ago') from ISO 8601 formatted dates and times embedded in your HTML (à la microformats).",
            "homepage":"http://timeago.yarp.com/",
            "keywords":[
                "time",
                "jquery",
                "dateformat",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Ryan McGeary",
                    "email":"ryan@mcgeary.org",
                    "web":"http://ryan.mcgeary.org/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/rmm5t/jquery-timeago"
                }
            ]

        }
        ,
        {
            "name":"jquery-tools",
            "filename":"jquery.tools.min.js",
            "version":"1.2.6",
            "description":"jQuery Tools is a collection of the most important user-interface components for modern websites. Used by large sites all over the world.",
            "homepage":"http://flowplayer.org/tools/index.html",
            "keywords":[
                "jquery",
                "ui",
                "tools"
            ],
            "maintainers":[
                {
                    "name":"jQuery Tools",
                    "email":"tipiirai+jquerytools@gmail.com",
                    "web":"http://flowplayer.org/tools/index.html"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jquerytools/jquerytools"
                }
            ]

        }
        ,
        {
            "name":"jquery.cycle",
            "filename":"jquery.cycle.all.min.js",
            "version":"2.99",
            "description":"Cycle is an easy-to-use slideshow plugin that provides many options and effects for creating beautiful slideshows.",
            "homepage":"http://jquery.malsup.com/cycle/",
            "keywords":[
                "jquery",
                "slideshow",
                "cycle"
            ],
            "maintainers":[
                {
                    "name":"Mike Alsup",
                    "email":"malsup@gmail.com",
                    "web":"http://jquery.malsup.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/malsup/cycle"
                }
            ]

        }
        ,
        {
            "name":"jquery.SPServices",
            "filename":"jquery.SPServices-0.7.1a.min.js",
            "version":"0.7.1a",
            "description":"SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.",
            "homepage":"http://spservices.codeplex.com/",
            "keywords":[
                "jquery",
                "spservices",
                "sharepoint",
                "services",
                "service"
            ],
            "maintainers":[
                {
                    "name":"Marc D Anderson",
                    "web":"http://sympmarc.com/"
                }
            ]

        },
        {
            "name":"jquery.transit",
            "filename":"jquery.transit.min.js",
            "version":"0.1.3",
            "description":"Super-smooth CSS3 transformations and transitions for jQuery.",
            "homepage":"http://ricostacruz.com/jquery.transit/",
            "keywords":[
                "css3",
                "transitions",
                "transformations",
                "jquery"
            ],
            "maintainers":[
                {
                    "name":"Rico Sta. Cruz",
                    "web":"http://ricostacruz.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/rstacruz/jquery.transit"
                }
            ]
        }
        ,
        {
            "name":"jqueryui",
            "filename":"jquery-ui.min.js",
            "version":"1.8.17",
            "description":"jQuery UI provides abstractions for low-level interaction and animation, advanced effects and high-level, themeable widgets, built on top of the jQuery JavaScript Library, that you can use to build highly interactive web applications.",
            "homepage":"http://jqueryui.com/",
            "keywords":[
                "ui",
                "themeing",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"JQuery UI Team"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jquery/jquery-ui"
                }
            ]

        }
        ,
        {
            "name":"js-signals",
            "filename":"js-signals.min.js",
            "version":"0.6.1",
            "description":"Custom Event/Messaging system for JavaScript.",
            "homepage":"http://millermedeiros.github.com/js-signals/",
            "keywords":[
                "event",
                "messaging",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Miller Medeiros",
                    "web":"http://www.millermedeiros.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/millermedeiros/js-signals"
                }
            ]

        }
        ,
        {
            "name":"json2",
            "filename":"json2.js",
            "version":"20110223",
            "description":"This file creates a global JSON object containing two methods: stringify and parse.",
            "homepage":"https://github.com/douglascrockford/JSON-js",
            "keywords":[
                "json",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Douglas Crockford",
                    "web":"http://crockford.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/douglascrockford/JSON-js"
                }
            ]

        }
        ,
        {
            "name":"json3",
            "version":"3.1.0",
            "filename":"json3.min.js",
            "description":"A modern JSON implementation compatible with nearly all JavaScript platforms.",
            "homepage":"http://bestiejs.github.com/json3",
            "main":"json3",
            "keywords":[
                "json",
                "spec",
                "ecma",
                "es5",
                "lexer",
                "parser",
                "stringify"
            ],
            "licenses":[
                {
                    "type":"MIT",
                    "url":"http://kit.mit-license.org/"
                }
            ],
            "author":{
                "name":"Kit Cambridge",
                "web":"http://kitcambridge.github.com"
            },
            "maintainers":[
                {
                    "name":"Kit Cambridge",
                    "web":"http://kitcambridge.github.com"
                }
            ],
            "bugs":{
                "url":"http://github.com/bestiejs/json3/issues"
            },
            "repository":{
                "type":"git",
                "url":"git://github.com/bestiejs/json3.git"
            }
        },
        {
            "name":"jsxgraph",
            "filename":"jsxgraphcore.js",
            "version":"0.93",
            "description":"JSXGraph is a cross-browser library for interactive geometry, function plotting, charting, and data visualization in a web browser.",
            "homepage":"http://jsxgraph.org/",
            "keywords":[
                "dynamic geometry",
                "function plotting",
                "mathematics education"
            ],
            "maintainers":[
                {
                    "name":"JSXGraph group at University of Bayreuth, Germany"
                }
            ],
            "repositories":[
                {
                    "type":"svn",
                    "url":"https://jsxgraph.svn.sourceforge.net/svnroot/jsxgraph"
                }
            ]
        }
        ,
        {
            "name":"kerning.js",
            "filename":"kerning.min.js",
            "version":"0.2",
            "description":"Take control of your web typography.",
            "homepage":"http://kerningjs.com/",
            "keywords":[
                "design",
                "typography",
                "kerning",
                "font",
                "fonts",
                "letters",
                "words"
            ],
            "maintainers":[
                {
                    "name":"Joshua Gross",
                    "web":"http://unwieldy.net"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/endtwist/kerning.js"
                }
            ]
        }
        ,
        {
            "name":"knockout",
            "filename":"knockout-min.js",
            "version":"2.0.0",
            "description":"Simplify dynamic JavaScript UIs by applying the Model-View-View Model (MVVM)",
            "homepage":"http://knockoutjs.com/",
            "keywords":[
                "mvvm",
                "ui",
                "templating"
            ],
            "maintainers":[
                {
                    "name":"Steven Sanderson",
                    "email":"steve@codeville.net",
                    "web":"http://blog.stevensanderson.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/SteveSanderson/knockout"
                }
            ]
        }
        ,
        {
            "name":"labjs",
            "filename":"LAB.min.js",
            "version":"2.0.3",
            "description":"LABjs (Loading And Blocking JavaScript) is an open-source (MIT license) project supported by Getify Solutions. The core purpose of LABjs is to be an all-purpose, on-demand JavaScript loader, capable of loading any JavaScript resource, from any location, into any page, at any time. Loading your scripts with LABjs reduces resource blocking during page-load, which is an easy and effective way to optimize your site's performance.",
            "homepage":"http://labjs.com/",
            "keywords":[
                "loader",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Kyle Simpson",
                    "website":"http://getify.me/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/getify/LABjs"
                }
            ]

        }
        ,
        {
            "name":"less.js",
            "filename":"less-1.3.0.min.js",
            "version":"1.3.0",
            "description":"LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions. LESS runs on both the client-side (IE 6+, Webkit, Firefox) and server-side, with Node.js.",
            "homepage":"http://lesscss.org/",
            "keywords":[
                "css",
                "css3",
                "html",
                "html5",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Alexis Sellier",
                    "website":"http://cloudhead.io/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/cloudhead/less.js"
                }
            ]

        }
        ,
        {
            "name":"masonry",
            "filename":"jquery.masonry.min.js",
            "version":"2.1.0",
            "description":"A dynamic layout plugin for jQuery.",
            "homepage":"http://masonry.desandro.com/",
            "keywords":[
                "jquery",
                "layout",
                "float"
            ],
            "maintainers":[
                {
                    "name":"David DeSandro",
                    "web":"http://desandro.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/desandro/masonry"
                }
            ]

        }
        ,
        {
            "name":"modernizr",
            "filename":"modernizr.min.js",
            "version":"2.5.3",
            "description":"Modernizr adds classes to the element which allow you to target specific browser functionality in your stylesheet. You don't actually need to write any Javascript to use it.",
            "homepage":"http://www.modernizr.com/",
            "keywords":[
                "css",
                "css3",
                "html",
                "html5",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Faruk Ates"
                },
                {
                    "name":"Alex Sexton"
                },
                {
                    "name":"Paul Irish"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/Modernizr/Modernizr"
                }
            ]

        }
        ,
        {
            "name":"mootools",
            "filename":"mootools-yui-compressed.js",
            "version":"1.3.2",
            "description":"MooTools is a compact, modular, Object-Oriented JavaScript framework designed for the intermediate to advanced JavaScript developer. It allows you to write powerful, flexible, and cross-browser code with its elegant, well documented, and coherent API.",
            "homepage":"http://mootools.net/",
            "keywords":[
                "framework",
                "toolkit",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Valerio Proietti",
                    "web":"http://mad4milk.net/"
                },
                {
                    "name":"Mootools Dev Team"
                }
            ]
        }
        ,
        {
            "name":"mustache.js",
            "filename":"mustache.min.js",
            "version":"0.4.2",
            "description":"mustache.js — Logic-less templates with JavaScript",
            "homepage":"https://github.com/janl/mustache.js",
            "keywords":[
                "templates",
                "templating"
            ],
            "maintainers":[
                {
                    "name":"Jan Lehnardt",
                    "email":"jan@apache.org",
                    "web":"http://jan.prima.de/plok/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/janl/mustache.js"
                }
            ]

        }

        ,
        {
            "name":"ninjaui",
            "filename":"jquery.ninjaui.min.js",
            "version":"1.0.1",
            "description":"The jQuery plugin for lethal interaction",
            "homepage":"http://ninjaui.com/",
            "keywords":[
                "ninjaui",
                "ui",
                "jquery"
            ],
            "maintainers":[
                {
                    "name":"Jamie R. Hoover and Faisal N. Jawdat",
                    "web":"http://ninjaui.com/"
                }
            ],
            "bugs":{
                "web":"https://github.com/ninja/ui/issues/"
            },

            "repositories":[
                {
                    "type":"plain file",
                    "url":"https://github.com/ninja/ui/"
                }
            ]

        }
        ,
        {
            "name":"noisy",
            "filename":"jquery.noisy.min.js",
            "version":"1.1",
            "description":"Adds random noise to the background of a given element.",
            "homepage":"http://rappdaniel.com/noisy/",
            "keywords":[
                "noisy",
                "noise generator",
                "canvas"
            ],
            "maintainers":[
                {
                    "name":"Daniel Rapp",
                    "email":"danielrappt@gmail.com",
                    "web":"http://rappdaniel.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/DanielRapp/Noisy"
                }
            ]
        }
        ,
        {
            "name":"ocanvas",
            "filename":"ocanvas.min.js",
            "version":"2.1.0",
            "description":"oCanvas is a JavaScript library that makes development with HTML5 canvas easy, by using an object-based approach.",
            "homepage":"http://ocanvas.org/",
            "keywords":[
                "html5",
                "canvas"
            ],
            "maintainers":[
                {
                    "name":"Johannes Koggdal",
                    "twitter":"JohannesKoggdal",
                    "web":"http://koggdal.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/koggdal/ocanvas"
                }
            ]

        }
        ,
        {
            "name":"openajax-hub",
            "filename":"OpenAjaxUnmanagedHub.min.js",
            "version":"2.0.7",
            "description":"The central feature of the OpenAjax Hub is its publish/subscribe event manager (the \"pub/sub manager\"), which enables loose assembly and integration of Ajax components. With the pub/sub manager, one Ajax component can publish (i.e., broadcast) an event to which other Ajax components can subscribe, thereby allowing these components to communicate with each other through the Hub, which acts as an intermediary message bus.",
            "homepage":"http://www.openajax.org/member/wiki/OpenAjax_Hub_1.0_Specification",
            "keywords":[
                "publish",
                "subscribe",
                "pub/sub",
                "hub",
                "messaging",
                "broadcast",
                "decoupling"
            ],
            "maintainers":[
                {
                    "name":"OpenAjax Alliance",
                    "web":"http://www.openajax.org/"
                }
            ],
            "repositories":[
                {
                    "type":"svn",
                    "url":"https://openajaxallianc.svn.sourceforge.net/svnroot/openajaxallianc",
                    "path":"hub20/trunk/src/OpenAjax.js"
                }
            ]
        }
        ,
        {
            "name":"openlayers",
            "filename":"OpenLayers.js",
            "version":"2.11",
            "description":"OpenLayers is a JavaScript library for building map applications on the web. OpenLayers is made available under a BSD-license. Please see license.txt in this distribution for more details.",
            "homepage":"http://openlayers.org/",
            "keywords":[
                "map",
                "openlayers",
                "maps"
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/openlayers/openlayers"
                }
            ]

        }
        ,
        {
            "name":"pagedown",
            "filename":"Markdown.Converter.js",
            "version":"1.0",
            "description":"PageDown is the JavaScript Markdown previewer used on Stack Overflow and the rest of the Stack Exchange network. It includes a Markdown-to-HTML converter and an in-page Markdown editor with live preview.",
            "homepage":"http://code.google.com/p/pagedown/wiki/PageDown",
            "keywords":[
                "markdown",
                "converter"
            ],
            "maintainers":[
                {
                    "name":"StackOverflow"
                }
            ],
            "repositories":[
                {
                    "type":"hg",
                    "url":"https://code.google.com/p/pagedown/"
                }
            ]

        }
        ,
        {
            "name":"pie",
            "filename":"PIE.js",
            "version":"1.0beta5",
            "description":"A behavior for Internet Explorer allowing it to recognize and render various CSS3 box decoration properties.",
            "homepage":"http://css3pie.com/",
            "keywords":[
                "ie",
                "internet",
                "explorer",
                "css3",
                "pie"
            ],
            "maintainers":[
                {
                    "name":"Jason Johnston",
                    "email":"jason@css3pie.com",
                    "web":"https://github.com/lojjic"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/lojjic/PIE"
                }
            ]

        }
        ,
        {
            "name":"platform",
            "version":"0.4.0",
            "filename":"platform.min.js",
            "description":"A platform detection library that works on nearly all JavaScript platforms.",
            "homepage":"https://github.com/bestiejs/platform.js",
            "main":"platform",
            "keywords":[
                "environment",
                "platform",
                "ua",
                "useragent"
            ],
            "licenses":[
                {
                    "type":"MIT",
                    "url":"http://mths.be/mit"
                }
            ],
            "author":{
                "name":"John-David Dalton",
                "email":"john@fusejs.com",
                "web":"http://allyoucanleet.com/"
            },
            "maintainers":[
                {
                    "name":"John-David Dalton",
                    "email":"john@fusejs.com",
                    "web":"http://allyoucanleet.com/"
                },
                {
                    "name":"Mathias Bynens",
                    "email":"mathias@qiwi.be",
                    "web":"http://mathiasbynens.be/"
                }
            ],
            "bugs":{
                "url":"https://github.com/bestiejs/platform.js/issues"
            },
            "repository":{
                "type":"git",
                "url":"https://github.com/bestiejs/platform.js.git"
            },
            "engines":[
                "node",
                "rhino"
            ],
            "directories":{
                "doc":"docs",
                "test":"tests"
            }
        },
        {
            "name":"prettify",
            "filename":"prettify.js",
            "version":"188.0.0",
            "description":"A Javascript module and CSS file that allows syntax highlighting of source code snippets in an html page.",
            "homepage":"http://code.google.com/p/google-code-prettify/",
            "keywords":[
                "code syntax highlighting"
            ],
            "repositories":[
                {
                    "type":"svn",
                    "url":"http://google-code-prettify.googlecode.com/svn/trunk/"
                }
            ]

        }
        ,
        {
            "name":"processing.js",
            "filename":"processing-api.min.js",
            "version":"1.3.6",
            "description":"A port of the Processing visualization language to JavaScript.",
            "homepage":"http://processingjs.org",
            "keywords":[
                "html5",
                "canvas"
            ],
            "maintainers":[
                {
                    "name":"John Resig",
                    "twitter":"jeresig",
                    "web":"http://ejohn.org"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jeresig/processing-js"
                }
            ]

        }
        ,
        {
            "name":"prototype",
            "filename":"prototype.js",
            "version":"1.7.0.0",
            "description":"Prototype is a JavaScript Framework that aims to ease development of dynamic web applications.",
            "homepage":"http://prototypejs.org/",
            "keywords":[
                "framework",
                "toolkit",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Prototype Core Team"
                }
            ]
        }
        ,
        {
            "name":"pubnub",
            "filename":"pubnub.min.js",
            "version":"3.1.2",
            "description":"PubNub, a new kind of Cloud-Hosted Broadcasting Service for Mass Communication.",
            "homepage":"http://www.pubnub.com/",
            "keywords":[
                "realtime",
                "messaging",
                "broadcasting",
                "publish",
                "subscribe",
                "mobile",
                "tablet",
                "android",
                "iphone",
                "html5",
                "webos",
                "cloud",
                "service",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"PubNub + TopMambo INC"
                }
            ]
        }
        ,
        {
            "name":"punycode",
            "version":"1.0.0",
            "filename":"punycode.min.js",
            "description":"A robust Punycode converter that fully complies to RFC 3492 and RFC 5891, and works on nearly all JavaScript platforms.",
            "homepage":"http://mths.be/punycode",
            "main":"punycode.js",
            "keywords":[
                "punycode",
                "unicode",
                "idn",
                "url",
                "domain"
            ],
            "licenses":[
                {
                    "type":"MIT",
                    "url":"http://mths.be/mit"
                }
            ],
            "author":{
                "name":"Mathias Bynens",
                "email":"mathias@qiwi.be",
                "web":"http://mathiasbynens.be/"
            },
            "maintainers":[
                {
                    "name":"Mathias Bynens",
                    "email":"mathias@qiwi.be",
                    "web":"http://mathiasbynens.be/"
                },
                {
                    "name":"John-David Dalton",
                    "email":"john@fusejs.com",
                    "web":"http://allyoucanleet.com/"
                }
            ],
            "bugs":{
                "url":"https://github.com/bestiejs/punycode.js/issues"
            },
            "repository":{
                "type":"git",
                "url":"https://github.com/bestiejs/punycode.js.git"
            },
            "engines":[
                "node",
                "rhino"
            ],
            "directories":{
                "doc":"docs",
                "test":"tests"
            }
        },
        {
            "name":"raphael",
            "filename":"raphael-min.js",
            "version":"2.1.0",
            "description":"Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web.",
            "homepage":"http://raphaeljs.com/",
            "keywords":[
                "vector",
                "graphics",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Dmitry Baranovskiy",
                    "web":"http://dmitry.baranovskiy.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/DmitryBaranovskiy/raphael/"
                }
            ]
        }
        ,
        {
            "name":"require.js",
            "filename":"require.min.js",
            "version":"0.26.0",
            "description":"Require.js merged with jQuery for loader goodness!",
            "homepage":"https://github.com/jrburke/require-jquery",
            "keywords":[
                "loader",
                "modules",
                "asynchronous",
                "popular",
                "jquery"
            ],
            "maintainers":[
                {
                    "name":"James Burke",
                    "web":"http://tagneto.blogspot.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jrburke/require-jquery"
                }
            ]

        }
        ,
        {
            "name":"require.js",
            "filename":"require.min.js",
            "version":"1.0.7",
            "description":"RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node",
            "homepage":"http://requirejs.org/",
            "keywords":[
                "loader",
                "modules",
                "asynchronous",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"James Burke",
                    "web":"http://tagneto.blogspot.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jrburke/requirejs"
                }
            ]

        }
        ,
        {
            "name":"respond.js",
            "filename":"respond.min.js",
            "version":"1.1.0",
            "description":"A fast & lightweight polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more).",
            "homepage":"https://github.com/scottjehl/Respond",
            "keywords":[
                "polyfill",
                "queries",
                "responsive",
                "max-width",
                "min-width"
            ],
            "maintainers":[
                {
                    "name":"Scott Jehl",
                    "email":"scott@scottjehl.com",
                    "web":"http://scottjehl.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/scottjehl/Respond"
                }
            ]

        },
        {
            "name":"sammy.js",
            "filename":"sammy.min.js",
            "version":"0.7.1",
            "description":"Sammy is a tiny javascript framework built on top of jQuery, It's RESTful Evented Javascript.",
            "homepage":"http://sammyjs.org/",
            "keywords":[
                "framework",
                "restful",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Aaron Quint"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/quirkey/sammy"
                }
            ]

        }
        ,
        {
            "name":"script.js",
            "filename":"script.min.js",
            "version":"1.3",
            "description":"$script.js is an asynchronous JavaScript loader and dependency manager with an astonishingly impressive lightweight footprint",
            "homepage":"http://www.dustindiaz.com/scriptjs/",
            "keywords":[
                "loader",
                "asynchronous",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Dustin Diaz",
                    "web":"http://www.dustindiaz.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/ded/script.js"
                }
            ]

        }
        ,
        {
            "name":"scriptaculous",
            "filename":"scriptaculous.js",
            "version":"1.8.3",
            "description":"script.aculo.us provides you with easy-to-use, cross-browser user interface JavaScript libraries to make your web sites and web applications fly.",
            "homepage":"http://script.aculo.us/",
            "keywords":[
                "ui",
                "toolkit",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Thomas Fuchs",
                    "web":"http://mir.aculo.us/"
                }
            ]
        }
        ,
        {
            "name":"selectivizr",
            "filename":"selectivizr-min.js",
            "version":"1.0.2",
            "description":"selectivizr is a JavaScript utility that emulates CSS3 pseudo-classes and attribute selectors in Internet Explorer 6-8. Simply include the script in your pages and selectivizr will do the rest.",
            "homepage":"http://selectivizr.com/",
            "keywords":[
                "css3",
                "ie"
            ],
            "maintainers":[
                {
                    "name":"Keith Clark",
                    "email":"create@keithclark.co.uk",
                    "web":"http://www.keithclark.co.uk/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/keithclark/selectivizr"
                }
            ]
        }
        ,
        {
            "name":"shred",
            "filename":"shred.bundle.min.js",
            "version":"0.7.12",
            "description":"Shred is an HTTP client library for browsers and node.js. Shred supports gzip, cookies, https, proxies, and redirects.",
            "homepage":"https://github.com/spire-io/shred",
            "keywords":[
                "http",
                "xhr",
                "ajax",
                "browserify"
            ],
            "maintainers":[
                {
                    "name":"Spire.io",
                    "email":"contact@spire.io",
                    "web":"http://spire.io"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/spire-io/shred"
                }
            ]
        },
        {
            "name":"sizzle",
            "filename":"sizzle.min.js",
            "version":"1.4.4",
            "description":"A pure-JavaScript CSS selector engine designed to be easily dropped in to a host library.",
            "homepage":"http://sizzlejs.com/",
            "keywords":[
                "dom",
                "selector",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"John Resig",
                    "web":"http://ejohn.org/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/jeresig/sizzle"
                }
            ]

        }
        ,
        {
            "name":"socket.io",
            "filename":"socket.io.min.js",
            "version":"0.9.5",
            "description":"Browser-side code for Socket.IO. Socket.IO aims to make realtime apps possible in every browser and mobile device, blurring the differences between the different transport mechanisms.",
            "homepage":"http://socket.io",
            "keywords":[
                "websockets",
                "node",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"LearnBoost"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"git://github.com/LearnBoost/Socket.IO.git"
                }
            ]
        }
        ,
        {
            "name":"sockjs-client",
            "filename":"sockjs-min.js",
            "version":"0.2.1",
            "description":"SockJS is a browser JavaScript library that provides a WebSocket-like object. SockJS gives you a coherent, cross-browser, Javascript API which creates a low latency, full duplex, cross-domain communication channel between the browser and the web server.",
            "homepage":"https://github.com/sockjs/sockjs-client",
            "keywords":[
                "websockets",
                "node"
            ],
            "maintainers":[
                {
                    "name":"Marek Majkowski"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/sockjs/sockjs-client"
                }
            ]
        }
        ,
        {
            "name":"stopcensorship.js",
            "filename":"stopcensorship.js",
            "version":"1.0",
            "description":"Use this script on your site to protest censorship of the Internet.",
            "homepage":"https://github.com/dougmartin/Stop-Censorship",
            "keywords":[
                "sopa"
            ],
            "maintainers":[
                {
                    "name":"Doug Martin"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/dougmartin/Stop-Censorship"
                }
            ]

        }
        ,
        {
            "name":"spin.js",
            "filename":"spin.min.js",
            "keywords":[
                "spinner",
                "utility"
            ],
            "description":"An animated CSS3 loading spinner with VML fallback for IE.",
            "version":"1.2.4",
            "homepage":"http://fgnass.github.com/spin.js/",
            "author":"Felix Gnass (http://fgnass.github.com/)",
            "maintainers":[
                {
                    "name":"Felix Gnass",
                    "web":"http://fgnass.github.com/"
                }
            ],
            "contributors":[
                "Felix Gnass (http://fgnass.github.com/)"
            ],
            "repository":{
                "type":"git",
                "url":"git://github.com/fgnass/spin.js.git"
            }
        }
        ,
        {
            "name":"spinejs",
            "filename":"spine.min.js",
            "version":"0.0.4",
            "description":"Spine is a lightweight framework for building JavaScript web applications",
            "homepage":"http://maccman.github.com/spine/",
            "keywords":[
                "mvc",
                "models",
                "controllers",
                "events",
                "routing",
                "popular",
                "orm"
            ],
            "maintainers":[
                {
                    "name":"Alex MacCaw",
                    "email":"info@eribium.org",
                    "web":"http://alexmaccaw.co.uk"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/maccman/spine"
                }
            ]
        }
        ,
        {
            "name":"store.js",
            "filename":"store.min.js",
            "keywords":[
                "storage"
            ],
            "description":"A localStorage wrapper for all browsers without using cookies or flash. Uses localStorage, globalStorage, and userData behavior under the hood",
            "version":"1.1.1",
            "homepage":"https://github.com/marcuswestin/store.js",
            "author":"Marcus Westin <narcvs@gmail.com> (http://marcuswest.in)",
            "maintainers":[
                {
                    "name":"Marcus Westin",
                    "email":"narcvs@gmail.com",
                    "web":"http://marcuswest.in"
                }
            ],
            "contributors":[
                "Matt Pizzimenti <mjpizz+github@gmail.com> (http://mjpizz.com)",
                "Long Ouyang (https://github.com/longouyang)",
                "Paul Irish (http://paulirish.com)",
                "Guillermo Rauch <rauchg@gmail.com> (https://github.com/guille)",
                "whitmer (https://github.com/whitmer)",
                "Steven Black <steveb@stevenblack.com> (https://github.com/StevenBlack)",
                "Marcus Tucker <info@marcustucker.com> (https://github.com/MarcusJT)"
            ],
            "repository":{
                "type":"git",
                "url":"git://github.com/marcuswestin/store.js.git"
            },
            "bugs":{
                "url":"http://github.com/marcuswestin/store.js/issues"
            },
            "engines":{
                "browser":"*",
                "node":"*"
            },
            "licenses":[
                {
                    "type":"MIT",
                    "url":"http://github.com/marcuswestin/store.js/raw/master/LICENSE"
                }
            ],
            "main":"store",
            "directories":{
                "lib":"."
            },
            "files":[
                ""
            ]
        }
        ,
        {
            "name":"string_score",
            "filename":"string_score.min.js",
            "version":"0.1.10",
            "description":"string_score - JavaScript string ranking library",
            "homepage":"https://github.com/joshaven/string_score",
            "keywords":[
                "search",
                "string ranking",
                "algorithms"
            ],
            "maintainers":[
                {
                    "name":"Joshaven Potter",
                    "email":"yourtech@gmail.com",
                    "web":"http://www.joshaven.com/string_score/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/joshaven/string_score.git"
                }
            ]

        }

        ,
        {
            "name":"swfobject",
            "filename":"swfobject.js",
            "version":"2.2",
            "description":"SWFObject is an easy-to-use and standards-friendly method to embed Flash content, which utilizes one small JavaScript file",
            "homepage":"http://code.google.com/p/swfobject/",
            "keywords":[
                "swf",
                "flash"
            ],
            "maintainers":[
                {
                    "name":"bobbyvandersluis"
                },
                {
                    "name":"aran.rhee"
                }
            ],
            "repositories":[
                {
                    "type":"svn",
                    "url":"http://swfobject.googlecode.com/svn/trunk/"
                }
            ]
        }
        ,
        {
            "name":"tinyscrollbar",
            "filename":"jquery.tinyscrollbar.min.js",
            "version":"1.66",
            "description":"A lightweight jQuery plugin to scroll content.",
            "homepage":"http://baijs.nl/tinyscrollbar/",
            "keywords":[
                "scrollbar",
                "jquery"
            ],
            "maintainers":[
                {
                    "name":"Maarten Baijs",
                    "web":"http://baijs.nl"
                }
            ],
            "repositories":[
                {
                    "type":"plain file",
                    "url":"http://baijs.nl/tinyscrollbar/js/jquery.tinyscrollbar.min.js"
                }
            ]

        }
        ,
        {
            "name":"twitter-bootstrap",
            "filename":"bootstrap.min.js",
            "version":"2.0.2",
            "description":"Javascript plugins for the Twitter Bootstrap toolkit",
            "homepage":"http://twitter.github.com/bootstrap/",
            "keywords":[
                "twitter",
                "bootstrap"
            ],
            "maintainers":[
                {
                    "name":"Twitter, Inc."
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/twitter/bootstrap"
                }
            ]
        }
        ,
        {
            "name":"twitterlib.js",
            "filename":"twitterlib.min.js",
            "version":"0.9.0",
            "description":"Library for doing all things Twitter API related, with added sauce for filtering, paging and paging",
            "homepage":"https://github.com/remy/twitterlib/",
            "keywords":[
                "twitter"
            ],
            "maintainers":[
                {
                    "name":"Remy Sharp"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/remy/twitterlib/"
                }
            ]

        },
        {
            "name":"underscore.js",
            "filename":"underscore-min.js",
            "version":"1.3.3",
            "description":"Underscore is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects. It's the tie to go along with jQuery's tux.",
            "homepage":"http://documentcloud.github.com/underscore/",
            "keywords":[
                "utility",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Jeremy Ashkenas",
                    "email":"jashkenas@gmail.com",
                    "web":"http://ashkenas.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/documentcloud/underscore/"
                }
            ]
        }
        ,
        {
            "name":"underscore.string",
            "filename":"underscore.string.min.js",
            "version":"2.0.0",
            "description":"Underscore.string is JavaScript library for comfortable manipulation with strings, extension for Underscore.js inspired by Prototype.js, Right.js, Underscore and beautiful Ruby language.",
            "homepage":"http://edtsech.github.com/underscore.string/",
            "keywords":[
                "utility",
                "string",
                "underscore"
            ],
            "maintainers":[
                {
                    "name":"Esa-Matti Suuronen",
                    "email":"esa-matti@suuronen.org",
                    "web":"http://esa-matti.suuronen.org"

                },
                {
                    "name":"Edward Tsech",
                    "email":"edtsech@gmail.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/edtsech/underscore.string/"
                }
            ]
        }
        ,
        {
            "name":"use.js",
            "filename":"use.js",
            "version":"0.2.0",
            "description":"RequireJS plugin for loading incompatible code.",
            "homepage":"https://github.com/tbranyen/use.js",
            "keywords":["requirejs", "amd"],
            "author":"Tim Branyen",
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/tbranyen/use.js.git"
                }
            ]
        }
        ,
        {
            "name":"visibility.js",
            "filename":"visibility.min.js",
            "version":"0.2",
            "description":"A wrapper for the Page Visibility API",
            "homepage":"https://github.com/evilmartians/visibility.js",
            "keywords":[
                "compatibility"
            ],
            "maintainers":[
                {
                    "name":"Evil Martians",
                    "email":"surrender@evilmartians.com",
                    "web":"http://evilmartians.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/evilmartians/visibility.js"
                }
            ]
        }
        ,
        {
            "name":"waypoints",
            "filename":"waypoints.min.js",
            "version":"1.1",
            "description":"Waypoints is a small jQuery plugin that makes it easy to execute a function whenever you scroll to an element.",
            "homepage":"http://imakewebthings.github.com/jquery-waypoints",
            "keywords":[
                "jquery",
                "scrolling"
            ],
            "maintainers":[
                {
                    "name":"Caleb Troughton",
                    "web":"http://imakewebthings.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/imakewebthings/jquery-waypoints"
                }
            ]

        }
        ,
        {
            "name":"webfont",
            "filename":"webfont.js",
            "version":"1.0.19",
            "description":"The WebFont Loader is a JavaScript library that gives you more control over font loading than the Google Font API provides.",
            "homepage":"http://code.google.com/apis/webfonts/docs/webfont_loader.html",
            "keywords":[
                "ui",
                "font"
            ],
            "maintainers":[
                {
                    "name":"Google"
                }
            ]
        }
        ,
        {
            "name":"xuijs",
            "filename":"xui.min.js",
            "version":"2.0.0",
            "description":"a super micro tiny dom library for authoring html5 mobile web applications.",
            "homepage":"http://xuijs.com/",
            "keywords":[
                "mobile",
                "html",
                "dom",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Brian LeRoux",
                    "web":"http://westcoastlogic.com"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/xui/xui"
                }
            ]

        }
        ,
        {
            "name":"yepnope",
            "filename":"yepnope.min.js",
            "version":"1.0.1",
            "description":"yepnope is a small wrapper around the super-fast LABjs script loader, and it allows you to load only the scripts that your users need.",
            "homepage":"http://yepnopejs.com/",
            "keywords":[
                "loader",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Alex Sexton",
                    "twitter":"SlexAxton",
                    "web":"http://alexsexton.com/"
                }
            ],
            "repositories":[
                {
                    "type":"git",
                    "url":"https://github.com/SlexAxton/yepnope.js"
                }
            ]

        }
        ,
        {
            "name":"yui",
            "filename":"yui-min.js",
            "version":"3.3.0",
            "description":"The YUI Library is a set of utilities and controls, written with JavaScript and CSS, for building richly interactive web applications using techniques such as DOM scripting, DHTML and AJAX.",
            "homepage":"http://developer.yahoo.com/yui/",
            "keywords":[
                "ui",
                "framework",
                "toolkit",
                "popular"
            ],
            "maintainers":[
                {
                    "name":"Yahoo! Inc."
                }
            ]
        }
        ,
        {
            "name":"zepto",
            "filename":"zepto.min.js",
            "version":"0.8",
            "description":"Zepto.js is a minimalist JavaScript framework for modern web browsers, with a jQuery-compatible syntax.",
            "homepage":"http://zeptojs.com/",
            "keywords":[
                "framework",
                "toolkit",
                "mobile",
                "webkit"
            ],
            "maintainers":[
                {
                    "name":"Thomas Fuchs"
                }
            ]
        }
    ];
    viewModel.packages(_.map(packages, function(package) {
        return {
            name: package.name,
            url: ["http://cdnjs.cloudflare.com/ajax/libs", package.name, package.version, package.filename].join('/')
        }
    }));
})();
