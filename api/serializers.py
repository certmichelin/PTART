from django.db import transaction
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from app.models import Project, Assessment, Sh0t, Label, Flag, Template, Screenshot, Case, Module, Methodology

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
        fields = ('id', 'title', 'asset', 'note', 'done', 'assessment', 'assignee')


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ('id', 'title', 'color')


class Sh0tSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(read_only=True, many=True)
    
    class Meta:
        model = Sh0t
        fields = ('id', 'title','labels', 'severity','cvss', 'asset', 'body', 'added', 'assessment')
    
    @transaction.atomic
    def create(self, validated_data):
        sh0t = Sh0t.objects.create(**validated_data)
        if "labels" in self.initial_data:
            labels = self.initial_data.get("labels")
            for label in labels:
                label_instance = Label.objects.get(pk=label)
                sh0t.labels.add(label_instance)
        sh0t.save()
        return sh0t


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
        fields = ('id', 'name', 'severity', 'asset', 'body')


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
