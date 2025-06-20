from django.contrib.auth.models import User
from django.db import transaction
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from ptart.models import Project, Assessment, Hit, Label, Flag, Template, Host, Service, Comment, HitReference, Screenshot, Attachment, Cvss3, Cvss4, CWEs, CWE, Case, Module, Methodology, AttackScenario, Recommendation, Tool, RetestCampaign, RetestHit, RetestScreenshot
from .tools import FileField


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class CWESerializer(serializers.ModelSerializer):
    class Meta:
        model = CWE
        fields = ('id', 'cwe_id', 'name', 'description', 'extended_description', 'cwes')

class CWEsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CWEs
        fields = ('id', 'version', 'deprecated')

class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = ('id', 'name', 'deprecated', 'url')

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ('id', 'name', 'description', 'reference', 'module')


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ('id', 'name', 'description', 'methodology')


class MethodologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Methodology
        fields = ('id', 'name', 'description', 'deprecated')
        
class ProjectSerializer(serializers.ModelSerializer):
    pentesters = UserSerializer(read_only=True, many=True)
    reviewers = UserSerializer(read_only=True, many=True)
    viewers = UserSerializer(read_only=True, many=True)
    tools = ToolSerializer(read_only=True, many=True)
    methodologies = MethodologySerializer(read_only=True, many=True)
    cwes = CWEsSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'name','executive_summary', 'engagement_overview', 'conclusion', 'scope', 'client', 'pentesters', 'reviewers', 'viewers', 'start_date', 'end_date', 'cvss_type', 'cwes', 'added', 'archived', 'tools', 'methodologies')
  
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
        
        if "reviewers" in self.initial_data:
            reviewers = self.initial_data.get("reviewers")
            for reviewer in reviewers:
                reviewer_instance = User.objects.get(pk=reviewer)
                project.reviewers.add(reviewer_instance)

        if "viewers" in self.initial_data:
            viewers = self.initial_data.get("viewers")
            for viewer in viewers:
                viewer_instance = User.objects.get(pk=viewer)
                project.viewers.add(viewer_instance)

        if "tools" in self.initial_data:
            tools = self.initial_data.get("tools")
            for tool in tools:
                tool_instance = Tool.objects.get(pk=tool)
                project.tools.add(tool_instance)

        if "cwes" in self.initial_data:
            cwes = self.initial_data.get("cwes")
            cwes_instance = CWEs.objects.get(pk=cwes)
            project.cwes = cwes_instance

        if "methodologies" in self.initial_data:
            methodologies = self.initial_data.get("methodologies")
            for methodology in methodologies:
                methodology_instance = Methodology.objects.get(pk=methodology)
                project.methodologies.add(methodology_instance)

        project.save()
        return project

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.pentesters.clear()
        pentesters = self.initial_data.get("pentesters")
        for pentester in pentesters:
            pentester_instance = User.objects.get(pk=pentester)
            instance.pentesters.add(pentester_instance)

        instance.reviewers.clear()
        reviewers = self.initial_data.get("reviewers")
        for reviewer in reviewers:
            reviewer_instance = User.objects.get(pk=reviewer)
            instance.reviewers.add(reviewer_instance)

        instance.viewers.clear()
        viewers = self.initial_data.get("viewers")
        for viewer in viewers:
            viewer_instance = User.objects.get(pk=viewer)
            instance.viewers.add(viewer_instance)

        instance.tools.clear()
        tools = self.initial_data.get("tools")
        for tool in tools:
            tool_instance = Tool.objects.get(pk=tool)
            instance.tools.add(tool_instance)

        instance.methodologies.clear()
        methodologies = self.initial_data.get("methodologies")
        for methodology in methodologies:
            methodology_instance = Methodology.objects.get(pk=methodology)
            instance.methodologies.add(methodology_instance)

        if "cwes" in self.initial_data:
            cwes = self.initial_data.get("cwes")
            cwes_instance = CWEs.objects.get(pk=cwes)
            instance.cwes = cwes_instance

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
        fields = ('id', 'title', 'deprecated', 'color')

class AttackScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttackScenario
        fields = ('id', 'name', 'scenario', 'svg', 'body', 'project')

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ('id', 'name', 'body', 'project')

class Cvss3Serializer(serializers.ModelSerializer):
    class Meta:
        model = Cvss3
        fields = ('id', 'attack_vector', 'attack_complexity','privilege_required','user_interaction','scope','confidentiality','integrity','availability','decimal_value')

class Cvss4Serializer(serializers.ModelSerializer):
    class Meta:
        model = Cvss4
        fields = ('id', 'attack_vector', 'attack_complexity', 'attack_requirements', 'privilege_required','user_interaction','confidentiality','integrity','availability','subsequent_confidentiality','subsequent_integrity','subsequent_availability','decimal_value')

class HitSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(read_only=True, many=True)
    cwes = CWESerializer(read_only=True, many=True)
    cvss3 = Cvss3Serializer(read_only=True)
    cvss4 = Cvss4Serializer(read_only=True)
    
    class Meta:
        model = Hit
        fields = ('id', 'title', 'labels', 'cwes', 'severity', 'cvss3', 'cvss4', 'asset', 'body', 'remediation', 'added', 'status', 'fix_complexity', 'assessment', 'get_unique_id')
    
    @transaction.atomic
    def create(self, validated_data):
        hit = Hit.objects.create(**validated_data)
        if "labels" in self.initial_data:
            labels = self.initial_data.get("labels")
            for label in labels:
                label_instance = Label.objects.get(pk=label)
                hit.labels.add(label_instance)
        if "cwes" in self.initial_data:
            cwes = self.initial_data.get("cwes")
            for cwe in cwes:
                cwe_instance = CWE.objects.get(pk=cwe)
                hit.cwes.add(cwe_instance)
        hit.save()
        return hit

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.labels.clear()
        labels = self.initial_data.get("labels")
        for label in labels:
            label_instance = Label.objects.get(pk=label)
            instance.labels.add(label_instance)

        instance.cwes.clear()
        cwes = self.initial_data.get("cwes")
        for cwe in cwes:
            cwe_instance = CWE.objects.get(pk=cwe)
            instance.cwes.add(cwe_instance)

        assessment = self.initial_data.get("assessment")
        instance.assessment = Assessment.objects.get(pk=assessment)

        instance.__dict__.update(**validated_data)
        instance.save()
        return instance

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'author', 'added')

class HitReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HitReference
        fields = ('id', 'name', 'url')

class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Host
        fields = ('id', 'hostname', 'ip', 'os', 'notes', 'project')

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'port', 'protocol', 'name', 'version', 'banner', 'host')

class ScreenshotSerializer(serializers.ModelSerializer):
    screenshot = Base64ImageField()
    
    class Meta:
        model = Screenshot
        fields = ('id', 'screenshot', 'caption', 'order', 'hit')

    @transaction.atomic
    def create(self, validated_data):
        screenshot=validated_data.pop('screenshot')
        hit=validated_data.pop('hit')
        caption=validated_data.pop('caption')
        return Screenshot.objects.create(screenshot=screenshot,caption=caption,hit=hit, order=hit.screenshot_set.count())

    
class RetestScreenshotSerializer(serializers.ModelSerializer):
    screenshot = Base64ImageField()
    
    class Meta:
        model = RetestScreenshot
        fields = ('id', 'screenshot', 'caption', 'order', 'retest_hit')

    @transaction.atomic
    def create(self, validated_data):
        screenshot=validated_data.pop('screenshot')
        retest_hit=validated_data.pop('retest_hit')
        caption=validated_data.pop('caption')
        return RetestScreenshot.objects.create(screenshot=screenshot,caption=caption, retest_hit=retest_hit, order=retest_hit.retestscreenshot_set.count())


class AttachmentSerializer(serializers.ModelSerializer):
    attachment = FileField()

    class Meta:
        model = Attachment
        fields = ('id', 'attachment', 'attachment_name', 'hit')

    def create(self, validated_data):
        attachment=validated_data.pop('attachment')
        attachment_name = validated_data.pop('attachment_name')
        hit=validated_data.pop('hit')
        return Attachment.objects.create(attachment=attachment, attachment_name=attachment_name, hit=hit)


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ('id', 'name', 'severity', 'asset', 'body', 'remediation', 'owner')


class RetestCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetestCampaign
        fields = ('id', 'name', 'start_date', 'end_date', 'project', 'introduction', 'conclusion')

class RetestHitSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetestHit
        fields = ('id', 'retest_campaign', 'hit', 'status', 'body')

    def validate(self, data):
        """Validate the fact that the retest campaign and the hit belong to the same project."""
        if "retest_campaign" not in self.initial_data :
            raise serializers.ValidationError({
                'retest_campaign': 'Retest Campaign id is required.'
                })
        
        if "hit" not in self.initial_data:
            raise serializers.ValidationError({
                'hit': 'Hit id is required.'
                })
        
        try:
            campaign = RetestCampaign.objects.get(pk=self.initial_data["retest_campaign"])
            hit = Hit.objects.get(pk=self.initial_data["hit"])
            if campaign is None or hit is None or campaign.project.id != hit.assessment.project.id :
                raise serializers.ValidationError({
                'object': 'Hit and Retest Campaign must belong to the same project.'
            })
        except RetestCampaign.DoesNotExist:
            raise serializers.ValidationError({
                'retest_campaign': 'Retest Campaign does not exist.'
            })
        except Hit.DoesNotExist:
            raise serializers.ValidationError({
                'hit': 'Hit does not exist.'
            })
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """Force the status on create and manage the unique constraint on the campaign and hit."""
        retest_hit = None
        try: 
            retest_hit = RetestHit.objects.create(**validated_data)
            
            if "retest_campaign" in self.initial_data:
                retest_hit.retest_campaign = RetestCampaign.objects.get(pk=self.initial_data["retest_campaign"])

            if "hit" in self.initial_data:
                retest_hit.retest_campaign = RetestCampaign.objects.get(pk=self.initial_data["retest_campaign"])
            
            retest_hit.status = "NT"
            retest_hit.save()
        except Exception as e:
            raise serializers.ValidationError({
                'Error': e.__str__()
            })
        return retest_hit
    
    @transaction.atomic
    def update(self, instance, validated_data):
        """Update only the status and the body of the retest hit"""
        instance.body = validated_data.get('body')
        instance.status = validated_data.get('status')
        instance.save()
        return instance

