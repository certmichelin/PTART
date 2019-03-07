import django_tables2 as tables

from .models import Project, Flag, Sh0t, Assessment, Project, Template, Methodology, Module, Case


"""ProjectTable class."""
class ProjectTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/project/{{ record.pk }}/summary"> {{ record.name }}</a>')

    class Meta:
        model = Project
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name', 'added')
        fields = ('name', 'added')


"""ProjectTable class."""
class FlagTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/flag/{{ record.pk }}"> {{ record.title }}</a>')
    done = tables.BooleanColumn(yesno='Done,Todo')
    project = tables.TemplateColumn('<a href="/app/project/{{ record.assessment.project.pk}}/summary">{{ record.assessment.project }}</a>')
    assessment = tables.TemplateColumn('<a href="/app/assessment/{{ record.assessment.pk}}">{{ record.assessment }}</a>')

    class Meta:
        model = Flag
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name', 'done', 'project', 'assessment', 'added')
        fields = ('name', 'added', 'done', 'project', 'assessment')
        empty_text = "No Flags yet"


"""ProjectTable class."""
class OpenFlagTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/flag/{{ record.pk }}"> {{ record.title }}</a>')
    project = tables.TemplateColumn('<a href="/app/project/{{ record.assessment.project.pk}}/summary">{{ record.assessment.project }}</a>')
    assessment = tables.TemplateColumn('<a href="/app/assessment/{{ record.assessment.pk}}">{{ record.assessment }}</a>')

    class Meta:
        model = Flag
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name', 'project', 'assessment', 'added')
        fields = ('name', 'added', 'project', 'assessment')


"""ProjectTable class."""
class Sh0tTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    severity = tables.TemplateColumn('<span class="bc-badge bc-badge--p{{ record.severity }}">P{{ record.severity }}</span>')
    title = tables.TemplateColumn('<a href="/app/sh0t/{{ record.pk }}">{{ record.title }}</a>')
    project = tables.TemplateColumn('<a href="/app/project/{{ record.assessment.project.pk}}/summary">{{ record.assessment.project }}</a>', order_by=('assessment.project'))
    assessment = tables.TemplateColumn('<a href="/app/assessment/{{ record.assessment.pk}}">{{ record.assessment }}</a>')
    cvss = tables.TemplateColumn('<span class="cvss label label-default">{{ record.cvss }}</span>', verbose_name= 'CVSS v3')
    #Specific element for CVSS.


    class Meta:
        model = Sh0t
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection','severity', 'cvss', 'title', 'project', 'assessment', 'added')
        fields = ('severity','cvss', 'title', 'project', 'assessment', 'added')


"""ProjectTable class."""
class AssessmentTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/assessment/{{ record.pk }}"> {{ record.name }}</a>')
    project = tables.TemplateColumn('<a href="/app/project/{{ record.project.pk}}/summary">{{ record.project }}</a>')

    class Meta:
        model = Assessment
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name', 'project', 'added')
        fields = ('name', 'project', 'added')


"""ProjectTable class."""
class TemplateTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    severity = tables.TemplateColumn('<span class="bc-badge bc-badge--p{{ record.severity }}">P{{ record.severity }}</span>')
    name = tables.TemplateColumn('<a href="/app/template/{{ record.pk }}">{{ record.name }}</a>')
    
    class Meta:
        model = Template
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection','severity', 'name')
        fields = ('severity', 'name')


"""MethodologyTable class."""
class MethodologyTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/methodology/{{ record.pk }}"> {{ record.name }}</a>')

    class Meta:
        model = Methodology
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name')
        fields = ('name', )


"""ModuleTable class."""
class ModuleTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/module/{{ record.pk }}"> {{ record.name }}</a>')
    methodology = tables.TemplateColumn('<a href="/app/methodology/{{ record.methodology.pk}}">{{ record.methodology }}</a>')

    class Meta:
        model = Module
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name', 'methodology')
        fields = ('name', 'methodology')


"""CaseTable class."""
class CaseTable(tables.Table):

    selection = tables.CheckBoxColumn(accessor='pk', attrs={"th__input": {"onclick": "toggle(this)"}}, orderable=False)
    name = tables.TemplateColumn('<a href="/app/case/{{ record.pk }}"> {{ record.name }}</a>')
    module = tables.TemplateColumn('<a href="/app/module/{{ record.module.pk}}">{{ record.module }}</a>')

    class Meta:
        model = Case
        template_name = "django_tables2/bootstrap-responsive.html"
        sequence = ('selection', 'name', 'module')
        fields = ('name', 'module')