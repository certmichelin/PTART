from django.conf import settings
from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.views import LoginView
from django_otp.forms import OTPAuthenticationForm
from django.urls import re_path

from ptart import views


urlpatterns = [
    re_path(r'^api/', include('api.urls')),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^accounts/login/', LoginView.as_view(authentication_form=OTPAuthenticationForm)),
    re_path(r'^accounts/', include('django.contrib.auth.urls')),
    re_path(r'^$', views.index),

    url(r'^projects/$', views.projects_all),
    url(r'^projects/new/$', views.projects_new),
    url(r'^project/([0-9]+)/$', views.project),
    url(r'^project/([0-9]+)/summary$', views.project_summary),
    url(r'^project/([0-9]+)/assets$', views.project_assets),
    url(r'^project/([0-9]+)/report$', views.project_report),

    url(r'^assessments/$', views.assessments_all),
    url(r'^assessments/new/$', views.assessments_new),
    url(r'^assessment/([0-9]+)/$', views.assessment),
    
    url(r'^hits/$', views.hits_all),
    url(r'^hits/new/$', views.hits_new),
    url(r'^hit/([0-9]+)/$', views.hit),

    url(r'^labels/$', views.labels_all),
    url(r'^labels/new/$', views.labels_new),
    url(r'^label/([0-9]+)/$', views.label),
    
    url(r'^flags/$', views.flags_all),
    url(r'^flags/new/$', views.flags_new),
    url(r'^flag/([0-9]+)/$', views.flag),
    
    url(r'^templates/$', views.templates_all),
    url(r'^templates/new/$', views.templates_new),
    url(r'^template/([0-9]+)/$', views.template),
    
    url(r'^cases/$', views.cases_all),
    url(r'^cases/new/$', views.cases_new),
    url(r'^case/([0-9]+)/$', views.case),
    
    url(r'^modules/$', views.modules_all),
    url(r'^modules/new/$', views.modules_new),
    url(r'^module/([0-9]+)/$', views.module),
    
    url(r'^methodologies/$', views.methodologies_all),
    url(r'^methodologies/new/$', views.methodologies_new),
    url(r'^methodology/([0-9]+)/$', views.methodology),

    url(r'^todo/$', views.my_todo),

    url(r'otp/$', views.generate_totp)
]

# Print banner on the console when the server starts
print(settings.BANNER)

# Custom Admin Site Header
admin.site.site_header = settings.NAME

#Unregister Group from Django Admin
admin.site.unregister(Group)