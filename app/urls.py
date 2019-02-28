from django.conf.urls import url

from app import views

urlpatterns = [
    url(r'^projects/$', views.projects_all),
    url(r'^projects/new/$', views.projects_new),
    url(r'^project/([0-9]+)/$', views.project),
    url(r'^project/([0-9]+)/summary$', views.project_summary),
    
    url(r'^assessments/$', views.assessments_all),
    url(r'^assessments/new/$', views.assessments_new),
    url(r'^assessment/([0-9]+)/$', views.assessment),
    
    url(r'^sh0ts/$', views.sh0ts_all),
    url(r'^sh0ts/new/$', views.sh0ts_new),
    url(r'^sh0t/([0-9]+)/$', views.sh0t),
    
    url(r'^flags/$', views.flags_all),
    url(r'^flags/new/$', views.flags_new),
    url(r'^flag/([0-9]+)/$', views.flag),
    
    url(r'^templates/$', views.templates_all),
    url(r'^templates/new/$', views.templates_new),
    url(r'^template/([0-9]+)/$', views.template),
    
    url(r'^cases/$', views.case_masters_all),
    url(r'^cases/new/$', views.case_masters_new),
    url(r'^case/([0-9]+)/$', views.case_master),
    
    url(r'^modules/$', views.module_masters_all),
    url(r'^modules/new/$', views.module_masters_new),
    url(r'^module/([0-9]+)/$', views.module_master),
    
    url(r'^methodologies/$', views.methodology_masters_all),
    url(r'^methodologies/new/$', views.methodology_masters_new),
    url(r'^methodology/([0-9]+)/$', views.methodology_master),
]