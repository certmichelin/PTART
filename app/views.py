from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django_tables2 import RequestConfig
from django.shortcuts import render, redirect

from .models import Assessment, Project, Sh0t, Flag, Template, Screenshot, Methodology, Module, Case, Severity
from .tables import FlagTable, OpenFlagTable, Sh0tTable, AssessmentTable, ProjectTable, TemplateTable, MethodologyTable, ModuleTable, CaseTable


@login_required
def index(request):
    """
        Index page of sh00t!
        Display a quick summary of the recent projects, sh0ts & flags.
    """
    recent_open_flags = Flag.objects.filter(done=False).order_by('-added')[:5]
    recent_sh0ts = Sh0t.objects.all().order_by('-added')[:5]
    recent_projects = Project.objects.all().order_by('-added')[:5]
    projects_count = Project.objects.all().count()
    assessments_count = Assessment.objects.all().count()
    shots_count = Sh0t.objects.all().count()
    flags_count = Flag.objects.all().count()

    context = {
        'recent_open_flags': recent_open_flags,
        'recent_sh0ts': recent_sh0ts,
        'recent_projects': recent_projects,
        'projects_count': projects_count,
        'assessments_count': assessments_count,
        'shots_count': shots_count,
        'flags_count': flags_count
    }
    return render(request, 'index.html', context)


@login_required
def projects_all(request):
    return generic_all(request, Project, ProjectTable, 'projects/projects-list.html')


@login_required
def assessments_all(request):
    return generic_all(request, Assessment, AssessmentTable, 'assessments/assessments-list.html')


@login_required
def sh0ts_all(request):
    return generic_all(request, Sh0t, Sh0tTable, 'sh0ts/sh0ts-list.html')


@login_required
def flags_all(request):
    return generic_all(request, Flag, FlagTable, 'flags/flags-list.html')

@login_required
def templates_all(request):
    return generic_all(request, Template, TemplateTable, 'templates/templates-list.html')


@login_required
def methodologies_all(request):
    return generic_all(request, Methodology, MethodologyTable, 'methodologies/methodologies-list.html')


@login_required
def modules_all(request):
    return generic_all(request, Module, ModuleTable, 'modules/modules-list.html')


@login_required
def cases_all(request):
    return generic_all(request, Case, CaseTable, 'cases/cases-list.html')


def generic_all_items(request, items, table_class_name, template_name) :
    table = table_class_name(items)
    RequestConfig(request).configure(table)
    context = {'table': table, 'count': items.count()}
    return render(request, template_name, context)


def generic_all(request, class_name, table_class_name, template_name) :
    return generic_all_items(request, class_name.objects.all(), table_class_name, template_name)


@login_required
def project(request, project_id):
    response = None
    try:
        response = render(request, 'projects/project-single.html', {'project': Project.objects.get(pk=project_id)})
    except Project.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def project_summary(request, project_id):
    response = None
    try:
        response = render(request, 'projects/project-summary.html', {'project': Project.objects.get(pk=project_id)})
    except Project.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def assessment(request, assessment_id):
    response = None
    try: 
        response = render(request, 'assessments/assessment-single.html', {'assessment': Assessment.objects.get(pk=assessment_id), 'projects': Project.objects.all().order_by('-added')})
    except Assessment.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def sh0t(request, sh0t_id):
    response = None
    try:
        response = render(request, 'sh0ts/sh0t-single.html', {'sh0t': Sh0t.objects.get(pk=sh0t_id), 'assessments': Assessment.objects.all().order_by('-added'), 'severities': Severity.values})
    except sh0t.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def flag(request, flag_id):
    response = None
    try:
        response = render(request, 'flags/flag-single.html', {'flag': Flag.objects.get(pk=flag_id), 'assessments': Assessment.objects.all().order_by('added')})
    except Flag.DoesNotExist:
        response = redirect('/')
    return response

    
@login_required
def template(request, template_id):
    response = None
    try:
        response = render(request, 'templates/template-single.html', {'template': Template.objects.get(pk=template_id), 'severities': Severity.values})
    except Template.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def methodology(request, methodology_id):
    response = None
    try:
        response = render(request, 'methodologies/methodology-single.html', {'methodology': Methodology.objects.get(pk=methodology_id)})
    except Methodology.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def module(request, module_id):
    response = None
    try:
        response = render(request, 'modules/module-single.html', {'module': Module.objects.get(pk=module_id), 'methodologies': Methodology.objects.all()})
    except Module.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def case(request, case_id):
    response = None
    try:
        response = render(request, 'cases/case-single.html', {'case': Case.objects.get(pk=case_id), 'modules': Module.objects.all()})
    except Case.DoesNotExist:
        response = redirect("/")
    return response


@login_required
def projects_new(request):
    return render(request, 'projects/projects.html', {})


@login_required
def assessments_new(request): 
    return render(request, 'assessments/assessments.html', {'projects': Project.objects.all().order_by('-added'), 'methodologies': Methodology.objects.all()})


@login_required
def sh0ts_new(request):
    return render(request, 'sh0ts/sh0ts.html', {'assessments_list':  Assessment.objects.all().order_by('-added'), 'templates': Template.objects.all(), 'severities': Severity.values})


@login_required
def flags_new(request):
    return render(request, 'flags/flags.html', {'assessments_list': Assessment.objects.all().order_by('-added')})


@login_required
def templates_new(request):
    return render(request, 'templates/templates.html', {'severities': Severity.values})


@login_required
def methodologies_new(request):
    return render(request, 'methodologies/methodologies.html')


@login_required
def modules_new(request):
    return render(request, 'modules/modules.html', {'methodologies': Methodology.objects.all()})


@login_required
def cases_new(request):
    return render(request, 'cases/cases.html', {'modules': Module.objects.all()})


@login_required
def logout_user(request):
    logout(request)
    return redirect('/')