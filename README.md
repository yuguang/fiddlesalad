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
    git clone git://github.com/yuguang/cloud_ide-templates.git
    mv cloud_ide-templates templates
    git clone git://github.com/yuguang/cloud_ide.git
    cd cloud_ide
    python setup.py install
    cd ../fiddlesalad
    mv settings.default.py settings.py
    pip install -r requirements.txt
    python manage.py runserver

Open http://127.0.0.1:8000/ in the browser.

Requirements
------------

* django >= 1.3.1
* django-mediasync >= 2.2.0
* django-social-auth >= 0.6.4
* django-taggit >= 0.9.3
* django-chunks >= 0.1

