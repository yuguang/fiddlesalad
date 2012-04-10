from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('fiddlesalad.python.views',
    (r'^compile/$', 'compile'),
    url(r'^documentation/$', 'documentation', name='fiddle_python_documentation'),
)