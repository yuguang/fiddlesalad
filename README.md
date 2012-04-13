Fiddle Salad Live Web Development
======================
An online playground with an instantly ready coding environment. 
#### [fiddlesalad.com](http://fiddlesalad.com)
 
Supported Languages
-------------------------------

* HTML
    * HAML
    * Zen Coding (input method)
    * Jade

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
from the js folder run
    coffee -cw -o ./compiled-coffee .\

###Installing Package Tools
if you don't have pip, see http://guide.python-distribute.org/installation.html for how to install it

Requirements
------------

* django >= 1.3.1
* django-mediasync >= 2.2.0
* django-social-auth >= 0.6.4
* django-taggit >= 0.9.3
* chunks >= 0.1
* beautifulsoup4 >= 4.0.1

Developer Documentation
-----------------------

The [wiki](https://github.com/yuguang/fiddlesalad/wiki) has information on the overall design.