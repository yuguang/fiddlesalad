from django.conf.urls.defaults import patterns, include, url
from cloud_ide.shared.urls import urlpatterns as shared_urls
from home import views

urlpatterns = shared_urls +  patterns('cloud_ide.fiddle.views',
    url(r'^save/$', 'save', name='save_snippet'),
    url(r'^check_title/', 'check_title'),
    url(r'^(?P<language>[\w]+)/$', 'create', name='create_snippet'),
)

urlpatterns += patterns('',
    url(r'^utility/', include('fiddlesalad.utility.urls')),
)

urlpatterns += patterns('',
    url(r'^python/', include('fiddlesalad.python.urls')),
)

urlpatterns += patterns('',
    (r'^$', views.index),
)

urlpatterns += patterns('cloud_ide.fiddle.views',
    url(r'^(?P<language>[\w]+)/(?P<snippet_slug>[\w]+-[\w]+-[-\w]+)/$', 'open', name='open_snippet')
)

