from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    url(r'^flag/(?P<pk>[0-9]+)', views.flag),
    url(r'^flags/', views.flags),
    url(r'^sh0t/(?P<pk>[0-9]+)', views.sh0t),
    url(r'^sh0ts/', views.sh0ts),
    url(r'^screenshot/(?P<pk>[0-9]+)', views.screenshot),
    url(r'^screenshot/png/(?P<pk>[0-9]+)', views.screenshot_raw),
    url(r'^screenshots/', views.screenshots),
    url(r'^assessment/(?P<pk>[0-9]+)', views.assessment),
    url(r'^assessments/', views.assessments),
    url(r'^project/(?P<pk>[0-9]+)', views.project),
    url(r'^projects/', views.projects),
    url(r'^template/(?P<pk>[0-9]+)', views.template),
    url(r'^templates/', views.templates),
    url(r'^case-master/(?P<pk>[0-9]+)', views.case_master),
    url(r'^case-masters/', views.case_masters),
    url(r'^module-master/(?P<pk>[0-9]+)', views.module_master),
    url(r'^module-masters/', views.module_masters),
    url(r'^methodology-master/(?P<pk>[0-9]+)', views.methodology_master),
    url(r'^methodology-masters/', views.methodology_masters),
]
urlpatterns = format_suffix_patterns(urlpatterns)
