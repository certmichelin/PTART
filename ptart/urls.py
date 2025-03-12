from django.conf import settings
from django.conf.urls import include
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

    re_path(r'^projects/$', views.projects_all),
    re_path(r'^projects/new/$', views.projects_new),
    re_path(r'^project/([0-9]+)/$', views.project),
    re_path(r'^project/([0-9]+)/summary$', views.project_summary),
    re_path(r'^project/([0-9]+)/assets$', views.project_assets),
    re_path(r'^project/([0-9]+)/report$', views.project_report),

    re_path(r'^archives/$', views.archives_all),

    re_path(r'^assessments/$', views.assessments_all),
    re_path(r'^assessments/new/$', views.assessments_new),
    re_path(r'^assessment/([0-9]+)/$', views.assessment),

    re_path(r'^attackscenario/new/$', views.attackscenarios_new),
    re_path(r'^attackscenario/([0-9]+)/$', views.attackscenario),

    re_path(r'^recommendation/new/$', views.recommendations_new),
    re_path(r'^recommendation/([0-9]+)/$', views.recommendation),

    re_path(r'^retestcampaigns/new/$', views.retestcampaigns_new),
    re_path(r'^retestcampaign/([0-9]+)/$', views.retestcampaign),
    re_path(r'^retestcampaign/([0-9]+)/summary$', views.retestcampaign_summary),

    re_path(r'^retesthit/([0-9]+)/$', views.retesthit),
    
    re_path(r'^hits/$', views.hits_all),
    re_path(r'^hits/new/$', views.hits_new),
    re_path(r'^hit/([0-9]+)/$', views.hit),

    re_path(r'^cwes/$', views.cwes_all),
    re_path(r'^cwes/([0-9]+)/$', views.cwes),

    re_path(r'^labels/$', views.labels_all),
    re_path(r'^labels/new/$', views.labels_new),
    re_path(r'^label/([0-9]+)/$', views.label),

    re_path(r'^tools/$', views.tools_all),
    re_path(r'^tools/new/$', views.tools_new),
    re_path(r'^tool/([0-9]+)/$', views.tool),
    
    re_path(r'^flags/$', views.flags_all),
    re_path(r'^flags/new/$', views.flags_new),
    re_path(r'^flag/([0-9]+)/$', views.flag),
    
    re_path(r'^templates/$', views.templates_all),
    re_path(r'^templates/new/$', views.templates_new),
    re_path(r'^template/([0-9]+)/$', views.template),
    
    re_path(r'^cases/$', views.cases_all),
    re_path(r'^cases/new/$', views.cases_new),
    re_path(r'^case/([0-9]+)/$', views.case),
    
    re_path(r'^modules/$', views.modules_all),
    re_path(r'^modules/new/$', views.modules_new),
    re_path(r'^module/([0-9]+)/$', views.module),
    
    re_path(r'^methodologies/$', views.methodologies_all),
    re_path(r'^methodologies/new/$', views.methodologies_new),
    re_path(r'^methodology/([0-9]+)/$', views.methodology),

    re_path(r'^todo/$', views.my_todo),
    re_path(r'^otp/$', views.generate_totp),

    re_path(r'^token/$', views.token_management),

    re_path(r'^account/password/$', views.password_change)
]

# Print banner on the console when the server starts
print(settings.BANNER)

# Custom Admin Site Header
admin.site.site_header = settings.NAME

#Unregister Group from Django Admin
admin.site.unregister(Group)