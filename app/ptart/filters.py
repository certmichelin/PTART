import django_filters
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Submit, Row, Column, ButtonHolder, Button
from .models import Project

class ProjectFilter(django_filters.FilterSet):
    """
    Filter configuration for Project table.
    """
    name = django_filters.CharFilter(
        lookup_expr="icontains", 
        label="", 
        widget=django_filters.widgets.forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Name"}
        )
    )
    
    client = django_filters.CharFilter(
        lookup_expr="icontains", 
        label="", 
        widget=django_filters.widgets.forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Client"}
        )
    )
    class Meta:
        model = Project
        fields = ["name", "client"]

