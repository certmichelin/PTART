from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django_tables2 import RequestConfig
from django.shortcuts import render, redirect

from .models import Assessment, Project, Sh0t, Flag, Template, Screenshot, MethodologyMaster, ModuleMaster, CaseMaster
from .tables import FlagTable, OpenFlagTable, Sh0tTable, AssessmentTable, ProjectTable, TemplateTable, MethodologyMasterTable, ModuleMasterTable, CaseMasterTable


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
    return generic_all(request, Assessment, AssessmentTable, 'assessements/assessments-list.html')


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
def methodology_masters_all(request):
    return generic_all(request, MethodologyMaster, MethodologyMasterTable, 'methodology-masters/methodology-masters-list.html')


@login_required
def module_masters_all(request):
    return generic_all(request, ModuleMaster, ModuleMasterTable, 'module-masters/module-masters-list.html')


@login_required
def case_masters_all(request):
    return generic_all(request, CaseMaster, CaseMasterTable, 'case-masters/case-masters-list.html')

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
def flag(request, flag_id):
    submitted = ""
    try:
        the_flag = Flag.objects.get(pk=flag_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_flag.delete()
                return redirect('/app/flags/all/')

            assessment_id = request.POST.get('assessment', '') or -1
            the_flag.title = request.POST.get('title', '') or "Flag"
            the_flag.note = request.POST.get('note', '') or ""
            if "done" == request.POST.get('done', ''):
                the_flag.done = True
            else:
                the_flag.done = False
            the_flag.assessment = Assessment.objects.get(pk=assessment_id)
            the_flag.save()
            submitted = "success"
            return redirect('/app/flags/all/')
        assessments_list = Assessment.objects.all().order_by('added')
        context = {'flag': the_flag, 'assessments': assessments_list, 'submitted': submitted}
        return render(request, 'flag-single.html', context)
    except Flag.DoesNotExist:
        return redirect('/')
    except Assessment.DoesNotExist:
        return redirect('/')


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
def sh0t(request, sh0t_id):
    submitted = ""
    try:
        the_sh0t = Sh0t.objects.get(pk=sh0t_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_sh0t.delete()
                return redirect('/app/sh0ts/all/')
            try:
                the_sh0t.title = request.POST.get('title', '') or "sh0t"
                the_sh0t.body = request.POST.get('body', '') or ""
                the_sh0t.severity = request.POST.get('severity', '') or 5
                assessment_id = request.POST.get('assessment', '') or -1
                the_sh0t.assessment = Assessment.objects.get(pk=assessment_id)
                the_sh0t.save()
                submitted = "success"
            except Assessment.DoesNotExist:
                return redirect('/')

        assessments_list = Assessment.objects.all().order_by('-added')
        context = {'sh0t': the_sh0t, 'assessments': assessments_list, 'severities': [1,2,3,4,5], 'submitted': submitted}
        return render(request, 'sh0t-single.html', context)
    except sh0t.DoesNotExist:
        return redirect('/')


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
                selected_module = ModuleMaster.objects.get(id=selected_module_id)
                selected_cases = CaseMaster.objects.filter(module=selected_module)
                for selected_case in selected_cases:
                    note = "Module: " + selected_module.name + "\n\n" + selected_case.description
                    new_flag = Flag(title=selected_case.name, note=note, assessment=new_assessment,
                                    order=selected_case.order)
                    new_flag.save()
            submitted = "success"
        except Project.DoesNotExist:
            return redirect('/')
        except ModuleMaster.DoesNotExist:
            return redirect('/')
    assessments_list = Assessment.objects.all().order_by('-added')[:10]
    methodologies_list = MethodologyMaster.objects.all().order_by('order')
    modules_list = ModuleMaster.objects.all().order_by('order')
    projects_list = Project.objects.all().order_by('-added')
    context = {'assessments': assessments_list, 'projects': projects_list,
               'methodologies_list': methodologies_list, 'modules': modules_list, 'submitted': submitted}
    return render(request, 'assessments.html', context)





@login_required
def assessment(request, assessment_id):
    submitted = ""
    try:
        the_assessment = Assessment.objects.get(pk=assessment_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_assessment.delete()
                return redirect('/app/assessments/all/')

            project_id = request.POST.get('project', '') or -1
            the_assessment.name = request.POST.get('name', '') or "Assessment"
            the_assessment.project = Project.objects.get(pk=project_id)
            the_assessment.save()
            submitted = "success"
        recent_assessments = Assessment.objects.all().order_by('-added')[:10]
        projects_list = Project.objects.all().order_by('-added')
        context = {
            'assessment': the_assessment, 'recent_assessments': recent_assessments, 'projects': projects_list,
            'submitted': submitted
        }
        return render(request, 'assessment-single.html', context)
    except Assessment.DoesNotExist:
        return redirect('/')

    except Project.DoesNotExist:
        return redirect('/')


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
def project(request, project_id):
    submitted = ""
    try:
        the_project = Project.objects.get(pk=project_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_project.delete()
                return redirect('/app/projects/all/')

            the_project.name = request.POST.get('name', '') or "Project"
            the_project.scope = request.POST.get('scope', '') or "Scope"
            the_project.save()
            submitted = "success"
        context = {
            'project': the_project, 'submitted': submitted
        }
        return render(request, 'project-single.html', context)
    except Project.DoesNotExist:
        return redirect('/')

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
def template(request, template_id):
    submitted = ""
    try:
        the_template = Template.objects.get(pk=template_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_template.delete()
                return redirect('/app/templates/')

            the_template.name = request.POST.get('name', '') or "Template"
            the_template.severity = request.POST.get('severity', '') or 5
            the_template.body = request.POST.get('body', '') or ""
            the_template.save()
            submitted = "success"
        context = {'template': the_template, 'severities': [1,2,3,4,5], 'submitted': submitted}
        return render(request, 'template-single.html', context)
    except Template.DoesNotExist:
        return redirect('/')


@login_required
def case_masters_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Case Master"
        description = request.POST.get('description', '') or ""
        order = request.POST.get('order') or 1
        module_master_id = request.POST.get('module_master_id', '') or -1
        try:
            the_module = ModuleMaster.objects.get(pk=module_master_id)

            new_case_master = CaseMaster.objects.create(name=name, description=description, order=order,
                                                        module=the_module)
            new_case_master.save()
            submitted = "success"
        except ModuleMaster.DoesNotExist:
            return redirect('/')

    case_masters_list = CaseMaster.objects.all().order_by('order')[:10]
    modules_list = ModuleMaster.objects.all()
    context = {'case_masters': case_masters_list, 'modules': modules_list, 'submitted': submitted}
    return render(request, 'case_masters.html', context)


@login_required
def case_master(request, case_master_id):
    submitted = ""
    try:
        the_case_master = CaseMaster.objects.get(pk=case_master_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_case_master.delete()
                return redirect('/app/case-masters/')

            the_case_master.name = request.POST.get('name', '') or "Case Master"
            the_case_master.description = request.POST.get('description', '') or ""
            the_case_master.order = request.POST.get('order') or 1
            module_id = request.POST.get('module_id', '') or -1
            the_module = ModuleMaster.objects.get(pk=module_id)
            the_case_master.module = the_module
            the_case_master.save()
            submitted = "success"
        module_master_list = ModuleMaster.objects.all()
        context = {
            'case_master': the_case_master, 'submitted': submitted, 'module_masters': module_master_list
        }
        return render(request, 'case-master-single.html', context)
    except ModuleMaster.DoesNotExist:
        return redirect('/')

    except CaseMaster.DoesNotExist:
        return redirect("/")


@login_required
def module_masters_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Module Master"
        description = request.POST.get('description', '') or ""
        order = request.POST.get('order') or 1
        methodology_master_id = request.POST.get('methodology_master_id', '') or -1
        try:
            the_methodology = MethodologyMaster.objects.get(pk=methodology_master_id)

            new_module_master = ModuleMaster.objects.create(name=name, description=description, order=order,
                                                            methodology=the_methodology)
            new_module_master.save()
            submitted = "success"
        except MethodologyMaster.DoesNotExist:
            return redirect('/')

    module_masters_list = ModuleMaster.objects.all()
    methodologies_list = MethodologyMaster.objects.all()
    context = {'module_masters': module_masters_list, 'methodologies': methodologies_list, 'submitted': submitted}
    return render(request, 'module-masters.html', context)


@login_required
def module_master(request, module_master_id):
    submitted = ""
    try:
        the_module_master = ModuleMaster.objects.get(pk=module_master_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_module_master.delete()
                return redirect('/app/module-masters/')

            the_module_master.name = request.POST.get('name', '') or "Module Master"
            the_module_master.description = request.POST.get('description', '') or ""
            the_module_master.order = request.POST.get('order') or 1
            methodology = request.POST.get('methodology_id', '') or -1
            the_methodology = MethodologyMaster.objects.get(pk=methodology)
            the_module_master.methodology = the_methodology
            the_module_master.save()
            submitted = "success"
        methodology_master_list = MethodologyMaster.objects.all()
        context = {
            'module_master': the_module_master, 'submitted': submitted, 'methodology_masters': methodology_master_list
        }
        return render(request, 'module-master-single.html', context)
    except MethodologyMaster.DoesNotExist:
        return redirect('/')


@login_required
def methodology_masters_new(request):
    submitted = ""
    if "POST" == request.method:
        name = request.POST.get('name', '') or "Methodology Master"
        description = request.POST.get('description', '') or ""
        order = request.POST.get('order') or 1
        new_methodology_master = MethodologyMaster.objects.create(name=name, description=description, order=order)
        new_methodology_master.save()
        submitted = "success"

    methodology_masters_list = MethodologyMaster.objects.all()
    context = {'methodology_masters': methodology_masters_list, 'submitted': submitted}
    return render(request, 'methodology-masters.html', context)


@login_required
def methodology_master(request, methodology_id):
    submitted = ""
    try:
        the_methodology_master = MethodologyMaster.objects.get(pk=methodology_id)
        if "POST" == request.method:
            if "delete" == request.POST.get('delete', ''):
                the_methodology_master.delete()
                return redirect('/app/module-masters/')

            the_methodology_master.name = request.POST.get('name', '') or "Methodology Master"
            the_methodology_master.description = request.POST.get('description', '') or ""
            the_methodology_master.order = request.POST.get('order') or 1
            the_methodology_master.save()
            submitted = "success"

        context = {
            'methodology_master': the_methodology_master, 'submitted': submitted
        }
        return render(request, 'methodology-master-single.html', context)

    except MethodologyMaster.DoesNotExist:
        return redirect('/')


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
