from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django_tables2 import RequestConfig
from django.shortcuts import render, redirect

from .models import Assessment, Project, Sh0t, Flag, Template, Screenshot, Methodology, Module, Case
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
    if request.GET.get('open', 'all') == 'all' :
        return generic_all(request, Flag, FlagTable, 'flags/flags-list.html')
    else :
        return  generic_all_items(request, Flag.objects.filter(done=False), OpenFlagTable, 'flags/open-flags.html')


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

@login_required
def project(request, project_id):
    response = None
    try:
        response = render(request, 'projects/project-single.html', {'project': Project.objects.get(pk=project_id)})
    except Project.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def assessment(request, assessment_id):
    response = None
    try: 
        response = render(request, 'assessements/assessment-single.html', {'assessment': Assessment.objects.get(pk=assessment_id), 'recent_assessments': Assessment.objects.all().order_by('-added')[:10], 'projects': Project.objects.all().order_by('-added')})
    except Assessment.DoesNotExist:
        response = redirect('/')
    return response


@login_required
def sh0t(request, sh0t_id):
    response = None
    try:
        response = render(request, 'sh0ts/sh0t-single.html', {'sh0t': Sh0t.objects.get(pk=sh0t_id), 'assessments': Assessment.objects.all().order_by('-added'), 'severities': [1,2,3,4,5]})
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
        response = render(request, 'templates/template-single.html', {'template': Template.objects.get(pk=template_id), 'severities': [1,2,3,4,5]})
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
def flags_new(request):
    submitted = ""
    if "POST" == request.method:
        title = request.POST.get('title', '') or "Flag"
        note = request.POST.get('note', '') or ""
        assessment_id = request.POST.get('assessment', '') or -1
        try:
            the_assessment = Assessment.objects.get(pk=assessment_id)
            new_flag = Flag.objects.create(title=title, note=note, assessment=the_assessment)
            new_flag.save()
            submitted = "success"
        except Assessment.DoesNotExist:
            return redirect('/')

    assessments_list = Assessment.objects.all().order_by('-added')
    recent_flags = Flag.objects.filter(done=False).order_by('-added')[:10]

    context = {'assessments_list': assessments_list, 'recent_flags': recent_flags, 'submitted': submitted}

    return render(request, 'flags.html', context)





@login_required
def sh0ts_new(request):
    submitted = ""
    if "POST" == request.method:
        title = request.POST.get('title', '') or "sh0t"
        body = request.POST.get('body', '') or ""
        severity = request.POST.get('severity', '') or 5
        assessment_id = request.POST.get('assessment', '') or -1
        try:
            the_assessment = Assessment.objects.get(pk=assessment_id)
            new_sh0t = Sh0t.objects.create(title=title, body=body, severity=severity, assessment=the_assessment)

            #Create associated screenshots.
            screenshotsMaxId = int(request.POST.get('screenshotMaxId', ''))
            for id in range(0,screenshotsMaxId) :
                data = request.POST.get('screenshot_' +  str(id), '')
                if data :
                    Screenshot.create_screenshot(screenshot=data,sh0t=new_sh0t)

            submitted = "success"
        except Assessment.DoesNotExist:
            return redirect('/')

    assessments_list = Assessment.objects.all().order_by('-added')
    templates_list = Template.objects.all()
    recent_sh0ts = Sh0t.objects.all().order_by('-added')[:10]
    context = {'assessments_list': assessments_list, 'templates': templates_list, 'severities': [1,2,3,4,5], 'recent_sh0ts': recent_sh0ts, 'submitted': submitted}
    return render(request, 'sh0ts.html', context)







@login_required
def assessments_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Assessment"
        project_id = request.POST.get('project', '') or -1
        try:
            the_project = Project.objects.get(pk=project_id)
            new_assessment = Assessment.objects.create(name=name, project=the_project)
            new_assessment.save()
            selected_modules = request.POST.getlist('modules')
            for selected_module_id in selected_modules:
                selected_module = Module.objects.get(id=selected_module_id)
                selected_cases = Case.objects.filter(module=selected_module)
                for selected_case in selected_cases:
                    note = "Module: " + selected_module.name + "\n\n" + selected_case.description
                    new_flag = Flag(title=selected_case.name, note=note, assessment=new_assessment,
                                    order=selected_case.order)
                    new_flag.save()
            submitted = "success"
        except Project.DoesNotExist:
            return redirect('/')
        except Module.DoesNotExist:
            return redirect('/')
    assessments_list = Assessment.objects.all().order_by('-added')[:10]
    methodologies_list = Methodology.objects.all().order_by('order')
    modules_list = Module.objects.all().order_by('order')
    projects_list = Project.objects.all().order_by('-added')
    context = {'assessments': assessments_list, 'projects': projects_list,
               'methodologies_list': methodologies_list, 'modules': modules_list, 'submitted': submitted}
    return render(request, 'assessments.html', context)

@login_required
def projects_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Project"
        scope = request.POST.get('scope', '') or "Scope"
        new_project = Project.objects.create(name=name, scope=scope)
        new_project.save()
        submitted = "success"
    projects_list = Project.objects.all().order_by('-added')[:10]
    context = {'projects': projects_list, 'submitted': submitted}
    return render(request, 'projects.html', context)

@login_required
def project_summary(request, project_id):
    submitted = ""
    try:
        the_project = Project.objects.get(pk=project_id)
        context = {
            'project': the_project
        }
        return render(request, 'project-summary.html', context)
    except Project.DoesNotExist:
        return redirect('/')


@login_required
def templates_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Template"
        severity = request.POST.get('severity', '') or 5
        body = request.POST.get('body', '') or ""
        new_template = Template.objects.create(name=name, severity=severity, body=body)
        new_template.save()
        submitted = "success"
    templates_list = Template.objects.all()[:10]
    context = {'templates': templates_list, 'severities': [1,2,3,4,5], 'submitted': submitted}
    return render(request, 'templates.html', context)




@login_required
def cases_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Case "
        description = request.POST.get('description', '') or ""
        order = request.POST.get('order') or 1
        module_id = request.POST.get('module_id', '') or -1
        try:
            the_module = Module.objects.get(pk=module_id)

            new_case = Case.objects.create(name=name, description=description, order=order,
                                                        module=the_module)
            new_case.save()
            submitted = "success"
        except Module.DoesNotExist:
            return redirect('/')

    cases_list = Case.objects.all().order_by('order')[:10]
    modules_list = Module.objects.all()
    context = {'cases': cases_list, 'modules': modules_list, 'submitted': submitted}
    return render(request, 'cases.html', context)





@login_required
def modules_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Module "
        description = request.POST.get('description', '') or ""
        order = request.POST.get('order') or 1
        methodology_id = request.POST.get('methodology_id', '') or -1
        try:
            the_methodology = Methodology.objects.get(pk=methodology_id)

            new_module = Module.objects.create(name=name, description=description, order=order,
                                                            methodology=the_methodology)
            new_module.save()
            submitted = "success"
        except Methodology.DoesNotExist:
            return redirect('/')

    modules_list = Module.objects.all()
    methodologies_list = Methodology.objects.all()
    context = {'modules': modules_list, 'methodologies': methodologies_list, 'submitted': submitted}
    return render(request, 'modules.html', context)





@login_required
def methodologies_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Methodology "
        description = request.POST.get('description', '') or ""
        order = request.POST.get('order') or 1
        new_methodology = Methodology.objects.create(name=name, description=description, order=order)
        new_methodology.save()
        submitted = "success"

    methodologies_list = Methodology.objects.all()
    context = {'methodologies': methodologies_list, 'submitted': submitted}
    return render(request, 'methodologies.html', context)

@login_required
def logout_user(request):
    logout(request)
    return redirect('/')

def generic_all_items(request, items, table_class_name, template_name) :
    table = table_class_name(items)
    RequestConfig(request).configure(table)
    context = {'table': table, 'count': items.count()}
    return render(request, template_name, context)

def generic_all(request, class_name, table_class_name, template_name) :
    return generic_all_items(request, class_name.objects.all(), table_class_name, template_name)
