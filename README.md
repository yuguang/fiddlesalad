Fiddle Salad Live Web Development
======================
The most advanced web development IDE
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
    * Diff
* Import from existing site

Supported Languages
-------------------

* HTML
    * HAML
    * Zen Coding (input method)
    * Jade
    * CoffeeCup

* CSS
    * SASS and SCSS with Compass
    * LESS
    * Stylus

* JavaScript
    * CoffeeeScript
    * Python

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

Developer Documentation
-----------------------

The [wiki](https://github.com/yuguang/fiddlesalad/wiki) has information on the overall design.

Contribution Guidelines
-----------------------

Features ready to be implemented:

* Save lint options with fiddle, as a part of the JSON
* SCSS mode smart indent
* HTML class and id auto-complete
    
###Syntax Highlighting
Get started by reading the [CodeMirror manual](http://codemirror.net/doc/manual.html#modeapi). The modes are under _static/js/codemirror/mode/_. Each mode has an index.html page for testing the mode. 

Contributors
------------

Thanks to

* [Tom Wilson](https://github.com/twilson63) for the CoffeeCup compiler
* [Lorin Tackett](https://github.com/ltackett) for home page redesign (in progress)