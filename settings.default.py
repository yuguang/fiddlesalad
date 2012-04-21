# Django settings for fiddlesalad project.
import os
PROJECT_DIR = os.path.dirname(__file__)

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
# ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'fiddle',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(PROJECT_DIR, "static")

PYTHON_LIB_DIR = os.path.join(PROJECT_DIR, "static\\lib")

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = 'http://127.0.0.1:8000/static/'

MEDIA_VERSION = '2012032020'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

AWS_ACCESS_KEY_ID = 's3_key'

AWS_SECRET_ACCESS_KEY = 's3_secret'

AWS_STORAGE_BUCKET_NAME = 'bucket_name'

build_config = False

if not build_config:
    FILES = {
        'BOWSER': 'js/bowser.js',
        'UNDERSCORE': 'js/underscore.js',
        'VALIDATE': 'js/jquery.validate.js',
        'KNOCKOUT': 'js/knockout-latest.debug.js',
        'KNOCKOUT_MAPPING': 'js/knockout.mapping.js',
        }
else:
    FILES = {
        'BOWSER': 'js/build/lib/bowser.min.js',
        'UNDERSCORE': 'js/build/lib/underscore.min.js',
        'VALIDATE': 'js/build/lib/jquery.validate.min.js',
        'KNOCKOUT': 'js/build/lib/knockout.min.js',
        'KNOCKOUT_MAPPING': 'js/build/lib/knockout.mapping.min.js',
        }

# Media files
MEDIASYNC = {
    'BACKEND': 'mediasync.backends.s3',
    'AWS_KEY': AWS_ACCESS_KEY_ID,
    'AWS_SECRET': AWS_SECRET_ACCESS_KEY,
    'AWS_BUCKET': AWS_STORAGE_BUCKET_NAME,
    'JOINED': {
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
            'css/simple-hint.css',
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
            'js/codemirror/simple-hint.js',
            'js/codemirror/javascript-hint.js',
            'js/codemirror/dialog.js',
            'js/codemirror/searchcursor.js',
            'js/codemirror/search.js',
            'js/codemirror/formatting.js',
            'js/keywords.js',
            'js/codemirror/closetag.js',
            'js/codemirror/mode/python/python.js',
            'js/codemirror/mode/javascript/javascript.js',
            'js/codemirror/mode/coffeescript/coffeescript.js',
            'js/codemirror/mode/less/less.js',
            'js/codemirror/mode/css/css.js',
            'js/codemirror/mode/xml/xml.js',
            'js/codemirror/mode/htmlmixed/htmlmixed.js',
            'js/codemirror/mode/haml/haml.js',
            'js/codemirror/mode/jade/jade.js',
            'js/codemirror/mode/sass/sass.js',
            'js/codemirror/mode/scss/scss.js',
            'js/codemirror/mode/markdown/markdown.js',
            'js/codemirror/mode/stylus/stylus.js',
            'js/codemirror/runmode.js',
            ],
        'js/fiddle.plugins.js': [
            'js/jquery.csrf.js',
            'js/jquery.spellchecker.js',
            'js/jquery.history.js',
            'js/mergely.js',
            ],
        'js/fiddle.init.js': [
            'js/prefixfree.js',
            'js/date.format.js',
            'js/compiled-coffee/model.js',
            'js/fiddle.js',
            'js/layout.js',
            'js/packages.fiddle.js',
            'js/htmlparser.js',
            'js/jade.runtime.min.js',
            'js/jquery.noty.js',
            'js/beautify.js',
            ],
        'js/menu.fiddle.js': [
            'js/fiddle-configuration.js',
            'js/keywords.js',
            'js/underscore.js',
            'js/queue.js',
            'js/store.js',
            'js/classy.js',
            'js/compiled-coffee/codestorage.js',
            'js/compiled-coffee/menu.js',
            ]
    },
}

if build_config:
    MEDIASYNC['PROCESSORS'] = ('mediasync.processors.closurecompiler.compile','mediasync.processors.slim.css_minifier',)
    #MEDIASYNC['PROCESSORS'] = ('mediasync.processors.combine.default',)
    MEDIASYNC['JOINED']['js/jquery-ui.fiddle.js'] = [
        'js/build/lib/jquery-ui-1.8.18.custom.min.js',
        'js/build/lib/jquery.wijmo.wijutil.min.js',
        'js/build/lib/jquery.wijmo.wijdialog.min.js',
        'js/build/lib/jquery.wijmo.wijsplitter.min.js',
        'js/build/lib/jquery.wijmo.wijmenu.min.js',
        ]

MEDIASYNC['SERVE_REMOTE'] = False

# Additional locations of static files
STATICFILES_DIRS = (
# Put strings here, like "/home/html/static" or "C:/www/django/static".
# Always use forward slashes, even on Windows.
# Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #    'django.contrib.staticfiles.finders.DefaultStorageFinder',
    )

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'o#&0=io58r!=dhaf(gx@a5$n#2zy!b$k=yhu&^@uq^7=$v%&k('

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    #     'django.template.loaders.eggs.Loader',
    )

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
    'cloud_ide.context_processors.debug',
    'cloud_ide.context_processors.media',
    'fiddlesalad.context_processors.site',
    )

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.redirects.middleware.RedirectFallbackMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware'
    )

ROOT_URLCONF = 'fiddlesalad.urls'

TEMPLATE_DIRS = (
    os.path.join(os.path.dirname(PROJECT_DIR), "templates"),
    os.path.join(PROJECT_DIR, "templates"),
    )

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.admin',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.flatpages',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.redirects',
    'mediasync',
    'taggit',
    'social_auth',
    'chunks',
    'cloud_ide.fiddle',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    )

AUTHENTICATION_BACKENDS = (
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.facebook.FacebookBackend',
    'social_auth.backends.google.GoogleOAuthBackend',
    'django.contrib.auth.backends.ModelBackend',
    )

LOGIN_URL          = '/login/'
LOGIN_REDIRECT_URL = '/done/'

TWITTER_CONSUMER_KEY              = '65tXXWpGJ0PfsZzN1xR7Q'
TWITTER_CONSUMER_SECRET           = 'KZa2FPOjIByvdFqcHGTQNi01VouoTiqeAaZ8yelTh0'
FACEBOOK_APP_ID                   = '244638052233650'
FACEBOOK_API_SECRET               = '66c1d60fe6f777dc52c2c3eef5752fbf'
LINKEDIN_CONSUMER_KEY             = ''
LINKEDIN_CONSUMER_SECRET          = ''
ORKUT_CONSUMER_KEY                = ''
ORKUT_CONSUMER_SECRET             = ''
GOOGLE_OAUTH2_CLIENT_KEY          = '823652973862.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET       = 'yQ4l2KebfymlugAnTgS6l2ID'
LOGIN_ERROR_URL                   = '/login/error/'
#SOCIAL_AUTH_USER_MODEL            = 'app.CustomUser'
SOCIAL_AUTH_ERROR_KEY             = 'socialauth_error'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
            },
        }
}
