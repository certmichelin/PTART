from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from django_otp.decorators import otp_required
from django_otp.models import Device

from django_tables2 import RequestConfig
from django.shortcuts import render, redirect

import base64

from io import BytesIO

from qrcode import make as generate_qrcode
from qrcode.image.svg import SvgPathImage as svg

from rest_framework.authtoken.models import Token

from .models import (
    Assessment,
    Project,
    Hit,
    Flag,
    Template,
    Methodology,
    Module,
    Case,
    Severity,
    CWEs,
    Label,
    AttackScenario,
    Recommendation,
    Tool,
    RetestCampaign,
    RetestHit,
)
from .tables import (
    FlagTable,
    HitTable,
    AssessmentTable,
    ProjectTable,
    TemplateTable,
    MethodologyTable,
    ModuleTable,
    CaseTable,
    CWEsTable,
    LabelTable,
    ToolTable,
)


@otp_required
def index(request):
    """
    Index page of PTART!
    Display a quick summary of the recent projects, hits & flags.
    """
    recent_open_flags = (
        Flag.get_viewable(request.user).filter(done=False).order_by("-added")[:5]
    )
    recent_hits = Hit.get_viewable(request.user).order_by("-added")[:5]
    recent_projects = Project.get_viewable(request.user).order_by("-added")[:5]

    projects_count = Project.get_viewable(request.user).count()
    assessments_count = Assessment.get_viewable(request.user).count()
    hits_count = Hit.get_viewable(request.user).count()
    open_flags_count = Flag.get_viewable(request.user).filter(done=False).count()

    context = {
        "recent_open_flags": recent_open_flags,
        "recent_hits": recent_hits,
        "recent_projects": recent_projects,
        "projects_count": projects_count,
        "assessments_count": assessments_count,
        "hits_count": hits_count,
        "open_flags_count": open_flags_count,
    }
    return generate_render(request, "index.html", context)


@otp_required
def token_management(request):
    """
    View to generate an authentication token or to revoke an existing token
    """
    context = {"token_exists": Token.objects.filter(user=request.user).exists()}

    return generate_render(request, "token/management.html", context)


@otp_required
def projects_all(request):
    return generic_all(
        request,
        Project.get_viewable(request.user),
        ProjectTable,
        "projects/projects-list.html",
    )


@otp_required
def archives_all(request):
    return generic_all(
        request,
        Project.get_archived_viewable(request.user),
        ProjectTable,
        "archives/archives-list.html",
    )


@otp_required
def assessments_all(request):
    return generic_all(
        request,
        Assessment.get_viewable(request.user),
        AssessmentTable,
        "assessments/assessments-list.html",
    )


@otp_required
def hits_all(request):
    return generic_all(
        request, Hit.get_viewable(request.user), HitTable, "hits/hits-list.html"
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def cwes_all(request):
    return generic_all(
        request, CWEs.get_viewable(request.user), CWEsTable, "cwes/cwes-list.html"
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def labels_all(request):
    return generic_all(
        request, Label.get_viewable(request.user), LabelTable, "labels/labels-list.html"
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def tools_all(request):
    return generic_all(
        request, Tool.get_viewable(request.user), ToolTable, "tools/tools-list.html"
    )


@otp_required
def flags_all(request):
    return generic_all(
        request, Flag.get_viewable(request.user), FlagTable, "flags/flags-list.html"
    )


@otp_required
def templates_all(request):
    return generic_all(
        request,
        Template.get_viewable(request.user),
        TemplateTable,
        "templates/templates-list.html",
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def methodologies_all(request):
    return generic_all(
        request,
        Methodology.get_viewable(request.user),
        MethodologyTable,
        "methodologies/methodologies-list.html",
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def modules_all(request):
    return generic_all(
        request,
        Module.get_viewable(request.user),
        ModuleTable,
        "modules/modules-list.html",
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def cases_all(request):
    return generic_all(
        request, Case.get_viewable(request.user), CaseTable, "cases/cases-list.html"
    )


def generic_all(request, items, table_class_name, template_name):
    table = table_class_name(items)
    RequestConfig(request).configure(table)
    context = {"table": table, "count": items.count()}
    return generate_render(request, template_name, context)


@otp_required
def project(request, project_id):
    response = None
    try:
        project = Project.objects.get(pk=project_id)
        if project.is_user_can_view(request.user):
            # This complex trick is necessary to continue to display the deprecated tools and methodologies in old projects.
            tools = list(
                dict.fromkeys(
                    list(Tool.get_not_deprecated(request.user))
                    + list(project.tools.all())
                )
            )
            methodologies = list(
                dict.fromkeys(
                    list(Methodology.get_not_deprecated(request.user))
                    + list(project.methodologies.all())
                )
            )
            cwes = list(CWEs.get_not_deprecated(request.user))
            if project.cwes not in cwes:
                cwes.append(project.cwes)
            response = generate_render(
                request,
                "projects/project-single.html",
                {
                    "project": project,
                    "users": User.objects.all(),
                    "cwes": cwes,
                    "tools": tools,
                    "methodologies": methodologies,
                    "editable": project.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Project.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def project_summary(request, project_id):
    response = None
    try:
        project = Project.objects.get(pk=project_id)
        if project.is_user_can_view(request.user):
            response = generate_render(
                request,
                "projects/project-summary.html",
                {
                    "project": project,
                    "editable": project.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Project.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def project_assets(request, project_id):
    response = None
    try:
        project = Project.objects.get(pk=project_id)
        if project.is_user_can_view(request.user):
            response = generate_render(
                request,
                "projects/project-assets.html",
                {
                    "project": project,
                    "editable": project.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Project.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def project_report(request, project_id):
    response = None
    try:
        project = Project.objects.get(pk=project_id)
        if project.is_user_can_view(request.user):
            response = generate_render(
                request, "projects/project-report.html", {"project": project}
            )
        else:
            response = redirect("/")
    except Project.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def assessment(request, assessment_id):
    response = None
    try:
        assessment = Assessment.objects.get(pk=assessment_id)
        if assessment.is_user_can_view(request.user):
            response = generate_render(
                request,
                "assessments/assessment-single.html",
                {
                    "assessment": assessment,
                    "projects": Project.get_viewable(request.user).order_by("-added"),
                    "editable": assessment.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Assessment.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def hit(request, hit_id):
    response = None
    try:
        hit = Hit.objects.get(pk=hit_id)
        # Embedded mode is used to display the hit in a smaller window (ie : RetestHit page)
        embedded = request.GET.get("embedded", False)
        if hit.is_user_can_view(request.user):
            # This complex trick is necessary to continue to display the deprecated labels in old projects (https://github.com/certmichelin/PTART/issues/73).
            labels = list(
                dict.fromkeys(
                    list(Label.get_not_deprecated(request.user))
                    + list(hit.labels.all())
                )
            )
            cwes = hit.assessment.project.cwes.cwe_set.all()
            response = generate_render(
                request,
                "hits/hit-single.html",
                {
                    "hit": hit,
                    "cvss_type": hit.assessment.project.cvss_type,
                    "assessments": hit.assessment.project.assessment_set.all,
                    "labels": labels,
                    "cwes": cwes,
                    "severities": Severity.values,
                    "editable": (hit.is_user_can_edit(request.user) and not embedded),
                    "embedded": embedded,
                },
            )
        else:
            response = redirect("/")
    except Hit.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def attackscenario(request, attackscenario_id):
    response = None
    try:
        attackscenario = AttackScenario.objects.get(pk=attackscenario_id)
        if attackscenario.is_user_can_view(request.user):
            response = generate_render(
                request,
                "attackscenarios/attackscenario-single.html",
                {
                    "attackscenario": attackscenario,
                    "editable": attackscenario.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except AttackScenario.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def recommendation(request, recommendation_id):
    response = None
    try:
        recommendation = Recommendation.objects.get(pk=recommendation_id)
        if recommendation.is_user_can_view(request.user):
            response = generate_render(
                request,
                "recommendations/recommendation-single.html",
                {
                    "recommendation": recommendation,
                    "editable": recommendation.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Recommendation.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def retestcampaign(request, requestcampaign_id):
    response = None
    try:
        retestcampaign = RetestCampaign.objects.get(pk=requestcampaign_id)
        if retestcampaign.is_user_can_view(request.user):
            response = generate_render(
                request,
                "retestcampaigns/retestcampaign-single.html",
                {
                    "retestcampaign": retestcampaign,
                    "editable": retestcampaign.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except RetestCampaign.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def retestcampaign_summary(request, requestcampaign_id):
    response = None
    try:
        retestcampaign = RetestCampaign.objects.get(pk=requestcampaign_id)
        if retestcampaign.is_user_can_view(request.user):
            response = generate_render(
                request,
                "retestcampaigns/retestcampaign-summary.html",
                {
                    "retestcampaign": retestcampaign,
                    "editable": retestcampaign.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Project.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def retesthit(request, retesthit_id):
    response = None
    try:
        retesthit = RetestHit.objects.get(pk=retesthit_id)
        if retesthit.is_user_can_view(request.user):
            response = generate_render(
                request,
                "retesthits/retesthit-single.html",
                {
                    "retesthit": retesthit,
                    "editable": retesthit.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Recommendation.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def label(request, label_id):
    response = None
    try:
        response = generate_render(
            request,
            "labels/label-single.html",
            {"label": Label.objects.get(pk=label_id)},
        )
    except Label.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def cwes(request, cwes_id):
    response = None
    try:
        response = generate_render(
            request, "cwes/cwes-single.html", {"cwes": CWEs.objects.get(pk=cwes_id)}
        )
    except CWEs.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def tool(request, tool_id):
    response = None
    try:
        response = generate_render(
            request, "tools/tool-single.html", {"tool": Tool.objects.get(pk=tool_id)}
        )
    except Tool.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def flag(request, flag_id):
    response = None
    try:
        flag = Flag.objects.get(pk=flag_id)
        if flag.is_user_can_view(request.user):
            response = generate_render(
                request,
                "flags/flag-single.html",
                {
                    "flag": flag,
                    "assessments": flag.assessment.project.assessment_set.all,
                    "users": User.objects.all(),
                    "editable": flag.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Flag.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def template(request, template_id):
    response = None
    try:
        template = Template.objects.get(pk=template_id)
        if template.is_user_can_view(request.user):
            response = generate_render(
                request,
                "templates/template-single.html",
                {
                    "template": template,
                    "severities": Severity.values,
                    "editable": template.is_user_can_edit(request.user),
                },
            )
        else:
            response = redirect("/")
    except Template.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def methodology(request, methodology_id):
    response = None
    try:
        response = generate_render(
            request,
            "methodologies/methodology-single.html",
            {"methodology": Methodology.objects.get(pk=methodology_id)},
        )
    except Methodology.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def module(request, module_id):
    response = None
    try:
        response = generate_render(
            request,
            "modules/module-single.html",
            {
                "module": Module.objects.get(pk=module_id),
                "methodologies": Methodology.get_viewable(request.user),
            },
        )
    except Module.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def case(request, case_id):
    response = None
    try:
        response = generate_render(
            request,
            "cases/case-single.html",
            {
                "case": Case.objects.get(pk=case_id),
                "modules": Module.get_viewable(request.user),
            },
        )
    except Case.DoesNotExist:
        response = redirect("/")
    return response


@otp_required
def projects_new(request):
    return generate_render(
        request,
        "projects/projects.html",
        {
            "users": User.objects.filter(is_active=True),
            "cwes": CWEs.get_not_deprecated(request.user),
            "tools": Tool.get_not_deprecated(request.user),
            "methodologies": Methodology.get_not_deprecated(request.user),
        },
    )


@otp_required
def assessments_new(request):
    return generate_render(
        request,
        "assessments/assessments.html",
        {
            "projects": Project.get_viewable(request.user).order_by("-added"),
            "methodologies": Methodology.get_viewable(request.user),
        },
    )


@otp_required
def hits_new(request):
    assessments = Assessment.get_viewable(request.user)
    cvss_type = 3
    try:
        project = Project.objects.get(pk=request.GET.get("projectId", ""))
        if project.is_user_can_edit(request.user):
            assessments = project.assessment_set.all
            cvss_type = project.cvss_type
            cwes = project.cwes.cwe_set.all()
    except:
        response = redirect("/")

    response = generate_render(
        request,
        "hits/hits.html",
        {
            "assessments": assessments,
            "cvss_type": cvss_type,
            "cwes": cwes,
            "templates": Template.get_usable(request.user),
            "labels": Label.get_not_deprecated(request.user),
            "severities": Severity.values,
            "editable": True,
        },
    )
    return response


@otp_required
def attackscenarios_new(request):
    response = None
    try:
        project = Project.objects.get(pk=request.GET.get("projectId", ""))
        if project.is_user_can_view(request.user):
            response = generate_render(
                request, "attackscenarios/attackscenarios.html", {"project": project}
            )
        else:
            response = redirect("/")
    except:
        response = redirect("/")
    return response


@otp_required
def recommendations_new(request):
    response = None
    try:
        project = Project.objects.get(pk=request.GET.get("projectId", ""))
        if project.is_user_can_view(request.user):
            response = generate_render(
                request, "recommendations/recommendations.html", {"project": project}
            )
        else:
            response = redirect("/")
    except:
        response = redirect("/")
    return response


@otp_required
def retestcampaigns_new(request):
    response = None
    try:
        project = Project.objects.get(pk=request.GET.get("projectId", ""))
        if project.is_user_can_view(request.user):
            response = generate_render(
                request, "retestcampaigns/retestcampaigns.html", {"project": project}
            )
        else:
            response = redirect("/")
    except:
        response = redirect("/")
    return response


@otp_required
@user_passes_test(lambda u: u.is_staff)
def labels_new(request):
    return generate_render(request, "labels/labels.html", {})


@otp_required
@user_passes_test(lambda u: u.is_staff)
def tools_new(request):
    return generate_render(request, "tools/tools.html", {})


@otp_required
def flags_new(request):
    assessments = Assessment.get_viewable(request.user)
    try:
        project = Project.objects.get(pk=request.GET.get("projectId", ""))
        if project.is_user_can_edit(request.user):
            assessments = project.assessment_set.all
    except:
        pass
    return generate_render(
        request,
        "flags/flags.html",
        {"assessments_list": assessments, "users": User.objects.filter(is_active=True)},
    )


@otp_required
def templates_new(request):
    return generate_render(
        request, "templates/templates.html", {"severities": Severity.values}
    )


@otp_required
def password_change(request):
    return generate_render(request, "account/password.html", {})


@otp_required
@user_passes_test(lambda u: u.is_staff)
def methodologies_new(request):
    return generate_render(request, "methodologies/methodologies.html", {})


@otp_required
@user_passes_test(lambda u: u.is_staff)
def modules_new(request):
    return generate_render(
        request,
        "modules/modules.html",
        {"methodologies": Methodology.get_viewable(request.user)},
    )


@otp_required
@user_passes_test(lambda u: u.is_staff)
def cases_new(request):
    return generate_render(
        request, "cases/cases.html", {"modules": Module.get_viewable(request.user)}
    )


@otp_required
def my_todo(request):
    projects = []
    for project in Project.get_viewable(request.user):
        assessments = []
        for assessment in project.assessment_set.all():
            flags = []
            for flag in Flag.objects.filter(
                assignee=request.user, assessment=assessment, done=False
            ):
                flags.append({"title": flag.title, "id": flag.id})
            if len(flags) > 0:
                assessments.append(
                    {"name": assessment.name, "id": assessment.id, "flags": flags}
                )
        if len(assessments) > 0:
            projects.append(
                {"name": project.name, "id": project.id, "assessments": assessments}
            )
    return generate_render(request, "mytodo.html", {"projects": projects})


def generate_render(request, template, data):
    # Override data by adding menu_projects that will be used in base.html
    data["menu_projects"] = Project.get_viewable(request.user).order_by("name")
    return render(request, template, data)


def generate_totp(request, detail=True):
    response = redirect("/")
    user = authenticate(
        request,
        username=request.POST.get("username", ""),
        password=request.POST.get("password", ""),
    )
    if user is not None:
        # Check if the user already has TOTP registered.
        if len(user.totpdevice_set.all()) == 0:
            device = user.totpdevice_set.create()
            with BytesIO() as stream:
                generate_qrcode(device.config_url, image_factory=svg).save(stream)
                response = render(
                    request,
                    "registration/otp.html",
                    {
                        "otp": base64.b64encode(stream.getvalue()).decode("utf-8"),
                        "key": device.key,
                    },
                )

    return response
