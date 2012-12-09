Fiddle Salad Live Web Development
======================
The web developer's wonderland that makes everyday tasks enjoyable, a live editor for front-end languages
#### [fiddlesalad.com](http://fiddlesalad.com)
 
Current Features
----------------
* Views
    * Results (live)
    * Compiled output (live)
        * CSS tooltips
        * jQuery API links
* Auto-complete
    * CSS keyword
    * HTML attributes
    * JavaScript context
* Saving
    * Local history
    * Diff of different revisions
* Converters
    * JS -> CoffeeScript
    * HTML -> Jade
	* HTML -> HAML
	* CSS -> SASS
	* CSS -> SCSS
* Import from existing site

Supported Languages
-------------------

* HTML
    * HAML
    * Zen Coding (input method)
    * Jade
    * CoffeeCup
    * Markdown

* CSS
    * SASS and SCSS with Compass
    * LESS
    * Stylus

* JavaScript
    * CoffeeeScript
    * Python
    * Roy

Getting the Code and Running it
-------------------------------

    git clone git://github.com/yuguang/fiddlesalad.git
    git clone git://github.com/yuguang/cloud-ide-templates.git
    mv cloud-ide-templates templates
    git clone git://github.com/yuguang/django-cloud-ide.git
    cd django-cloud-ide
    python setup.py install
    cd ../fiddlesalad
    mv settings.default.py settings.py
    pip install -r requirements.txt (see http://guide.python-distribute.org/installation.html if you don't have pip)
    python manage.py syncdb
    python manage.py runserver

Open http://127.0.0.1:8000/ in the browser.

Installation Notes
------------------
###Compiling CoffeeScript
from the _static/js/_ folder run

    coffee -cw -o ./compiled-coffee .\
	
###Compiling Less
run [less compiler](http://lesscss.org/#-server-side-usage) from the command line or install [SimpLESS](http://wearekiss.com/simpless)

###CoffeeScript Setup on Ubuntu
	sudo apt-get install coffeescript
	cd static/js/
	coffee -cw -o ./compiled-coffee ./

Developer Documentation
-----------------------

The [wiki](https://github.com/yuguang/fiddlesalad/wiki) has information on the overall design
as well as UML diagrams.


Contribution Guidelines
-----------------------

Features ready to be implemented:

* HTML class and id auto-complete
* Auto-semicolon insertion for CSS style languages
* Hide window title bar option
* Color picker when hovering over CSS color values in editor
* Homepage with vertical orientation and categorized languages
* Scroll source to current cursor position in editor
* Better CoffeeCup documentation page with syntax highlighting
    * Use CodeMirror's built-in run mode
* More Languages
    * [Eco](https://github.com/sstephenson/eco) ([Browserify](https://github.com/substack/node-browserify) nodejs module)
    * [Traceur](http://code.google.com/p/traceur-compiler/)
	* [Move](https://github.com/rsms/move)

###Foreign language Translations
Django's i18n middleware will be used, but only the translations are needed for buttons and labels.

* Spanish
* Russian
* German
* Japanese
* French
    
###Syntax Highlighting
Get started by reading the [CodeMirror manual](http://codemirror.net/doc/manual.html#modeapi). The modes are under _static/js/codemirror/mode/_.

###Language Editor
To add a language:

1. Modify the LANGUAGE and LANGUAGE_CATEGORY settings in *fiddle-configuration.js*. 
2. Write a class in *fiddle-engine.coffee* that inherits *(Style/Program/Document)Editor*
3. Create the compiler (aka worker) in _static/js/compilers/_ with the [sendResult and sendError functions](https://github.com/yuguang/fiddlesalad/blob/master/static/js/compilers/coffeescript.js). 
The compiler reads input from e.data for style and program editors and e.data.code for document editors
	
###User Interface
####Home
The Homepage uses [Twitter Bootstrap's fluid grid system](http://twitter.github.com/bootstrap/scaffolding.html#fluidGridSystem) 
to align buttons. The main files to modify are *templates/home.html* and *static/css/home.less*. 

####Fiddle
All UI elements are generated using [Knockout](http://knockoutjs.com/documentation/introduction.html)
and [jQuery UI](http://jqueryui.com/demos/). Knockout templates are in *templates/templates.html*, with the View Model
in *static/js/model.coffee*. Main stylesheet is *static/css/fiddle.less*. 

Contributors
------------

Thanks to

* [Tom Wilson](https://github.com/twilson63) for the CoffeeCup compiler
* [Lorin Tackett](https://github.com/ltackett) for home page redesign (in progress)