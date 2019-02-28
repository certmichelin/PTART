from django.conf import settings
from django.conf.urls import include
from django.contrib import admin
from django.urls import re_path

from app import views


urlpatterns = [
    re_path(r'^app/', include('app.urls')),
    re_path(r'^api/', include('api.urls')),
    re_path(r'^logout/$', views.logout_user),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^$', views.index),
]

# Print banner on the console when the server starts
print(settings.BANNER)

# Custom Admin Site Header
admin.site.site_header = settings.NAME
