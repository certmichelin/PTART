from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from app.models import Project, Assessment, Sh0t, Flag, Template, Screenshot, Case, Module, Methodology

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name','scope', 'added')


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ('id', 'name', 'added', 'project')


class FlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flag
        fields = ('id', 'title', 'note', 'done', 'assessment', 'assignee')


class Sh0tSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sh0t
        fields = ('id', 'title', 'severity','cvss', 'body', 'added', 'assessment')


class ScreenshotSerializer(serializers.ModelSerializer):
    screenshot = Base64ImageField()
    
    class Meta:
        model = Screenshot
        fields = ('id', 'screenshot', 'sh0t')

    def create(self, validated_data):
        screenshot=validated_data.pop('screenshot')
        sh0t=validated_data.pop('sh0t')
        return Screenshot.objects.create(screenshot=screenshot,sh0t=sh0t)


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ('id', 'name', 'severity', 'body')


class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ('id', 'name', 'description', 'module')


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ('id', 'name', 'description', 'methodology')


class MethodologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Methodology
        fields = ('id', 'name', 'description')
