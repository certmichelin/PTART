from app.models import Project, Assessment, Sh0t, Flag, Template, Screenshot
from configuration.models import CaseMaster, ModuleMaster, MethodologyMaster
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('name', 'added')


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ('name', 'added', 'project')


class FlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flag
        fields = ('id', 'title', 'note', 'done', 'assessment')


class Sh0tSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sh0t
        fields = ('title', 'severity', 'body', 'added', 'assessment')


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
        fields = ('name', 'severity', 'body')


class CaseMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseMaster
        fields = ('name', 'description', 'order', 'module')


class ModuleMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuleMaster
        fields = ('name', 'description', 'order', 'methodology')


class MethodologyMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MethodologyMaster
        fields = ('name', 'description', 'order')
