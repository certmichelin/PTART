from django.contrib.auth.models import User
from django.db import transaction
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from sh00t.models import Project, Assessment, Sh0t, Label, Flag, Template, Screenshot,Cvss, Case, Module, Methodology

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class ProjectSerializer(serializers.ModelSerializer):
    pentesters = UserSerializer(read_only=True, many=True)
    viewers = UserSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = ('id', 'name','scope', 'pentesters', 'viewers', 'added')
  
    def validate(self, data):
        """Validate the fact that at least one pentester is present on the project"""
        if "pentesters" not in self.initial_data or len(self.initial_data["pentesters"]) == 0 :
            raise serializers.ValidationError({
                'pentesters': 'At least one pentester is required'
                })
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        project = Project.objects.create(**validated_data)
        
        if "pentesters" in self.initial_data:
            pentesters = self.initial_data.get("pentesters")
            for pentester in pentesters:
                pentester_instance = User.objects.get(pk=pentester)
                project.pentesters.add(pentester_instance)
        
        if "viewers" in self.initial_data:
            viewers = self.initial_data.get("viewers")
            for viewer in viewers:
                viewer_instance = User.objects.get(pk=viewer)
                project.viewers.add(viewer_instance)

        project.save()
        return project

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.pentesters.clear()
        pentesters = self.initial_data.get("pentesters")
        for pentester in pentesters:
            pentester_instance = User.objects.get(pk=pentester)
            instance.pentesters.add(pentester_instance)

        instance.viewers.clear()
        viewers = self.initial_data.get("viewers")
        for viewer in viewers:
            viewer_instance = User.objects.get(pk=viewer)
            instance.viewers.add(viewer_instance)

        instance.__dict__.update(**validated_data)
        instance.save()
        return instance

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
        fields = ('id', 'title', 'labels', 'severity','cvss', 'asset', 'body', 'added', 'assessment')
    
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

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.labels.clear()
        labels = self.initial_data.get("labels")
        for label in labels:
            label_instance = Label.objects.get(pk=label)
            instance.labels.add(label_instance)

        assessment = self.initial_data.get("assessment")
        instance.assessment = Assessment.objects.get(pk=assessment)

        instance.__dict__.update(**validated_data)
        instance.save()
        return instance

class CvssSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cvss
        fields = ('id', 'attack_vector', 'attack_complexity','privilege_required','user_interaction','scope','confidentiality','integrity','availability','decimal_value')

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
