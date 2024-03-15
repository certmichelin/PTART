import base64
import math
import os
import pathlib

from cvss import CVSS3, CVSS4
from datetime import datetime
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q

"""Tool model."""
class Tool(models.Model):

    name = models.CharField(max_length=200)
    url = models.CharField(max_length=500)
    deprecated = models.BooleanField(default=False)

    def __str__(self):  
        return self.title

    def get_viewable(user):
        """Returns all viewable tools"""
        return Tool.objects.all()

    def get_not_deprecated(user):
        """Returns not deprecated tools"""
        return Tool.objects.filter(deprecated=False)

    def is_user_can_view(self, user):
        """Verify if the user have read access for this tool"""
        return True

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this tool"""
        return user.is_staff

    def is_user_can_create(self, user):
        """Verify if the user can create this tool"""
        return user.is_staff

    class Meta:
        ordering = ('pk',)

"""Methodology model."""
class Methodology(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    deprecated = models.BooleanField(default=False)

    def __str__(self):  
        return self.name

    def get_viewable(user):
        """Returns all viewable methodologies"""
        return Methodology.objects.all()

    def get_not_deprecated(user):
        """Returns not deprecated methodologies"""
        return Methodology.objects.filter(deprecated=False)

    def is_user_can_view(self, user):
        """Verify if the user have read access for this methodology"""
        return True

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this methodology"""
        return user.is_staff

    def is_user_can_create(self, user):
        """Verify if the user can create this methodology"""
        return user.is_staff

    class Meta:
        ordering = ('name',)


"""Module model."""
class Module(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    methodology = models.ForeignKey(Methodology, on_delete=models.CASCADE, null=True, default=None)

    def get_viewable(user):
        """Returns all viewable modules"""
        return Module.objects.all()

    def is_user_can_view(self, user):
        """Verify if the user have read access for this module"""
        return True

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this module"""
        return user.is_staff

    def is_user_can_create(self, user):
        """Verify if the user can create this module"""
        return user.is_staff

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('id',)


"""Case model."""
class Case(models.Model):
    name = models.CharField(max_length=100)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    reference = models.CharField(blank=True, default="",max_length=500)
    description = models.TextField(blank=True, default="")

    def get_viewable(user):
        """Returns all viewable cases"""
        return Case.objects.all()

    def is_user_can_view(self, user):
        """Verify if the user have read access for this case"""
        return True

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this case"""
        return user.is_staff

    def is_user_can_create(self, user):
        """Verify if the user can create this case"""
        return user.is_staff

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('id',)
        
""" Project model."""
class Project(models.Model):

    name = models.CharField(max_length=100)
    executive_summary = models.TextField(blank=True, default="")
    engagement_overview = models.TextField(blank=True, default="")
    conclusion = models.TextField(blank=True, default="")
    scope = models.TextField(blank=True, default="")
    client = models.CharField(max_length=200, blank=True, default="")
    added = models.DateTimeField(default=datetime.now)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    archived = models.BooleanField(default=False)
    cvss_type = models.IntegerField(default=3, validators=[MinValueValidator(3), MaxValueValidator(4)])
    tools = models.ManyToManyField(Tool)
    methodologies = models.ManyToManyField(Methodology)
    pentesters = models.ManyToManyField(User, related_name='%(class)s_pentesters')
    viewers = models.ManyToManyField(User, related_name='%(class)s_viewers')

    def __str__(self):  
        return self.name

    def p1_hits(self):
        """Return all P1 hits for the project."""
        return self.hits_by_severity(1)
    
    def p2_hits(self):
        """Return all P2 hits for the project."""
        return self.hits_by_severity(2)

    def p3_hits(self):
        """Return all P3 hits for the project."""
        return self.hits_by_severity(3)

    def p4_hits(self):
        """Return all P4 hits for the project."""
        return self.hits_by_severity(4)

    def p5_hits(self):
        """Return all P5 hits for the project."""
        return self.hits_by_severity(5)

    def hits_by_severity(self, severity):
        """Filter hits by severity for the project."""
        hits = []
        for assessment in self.assessment_set.all() :
            hits.extend(assessment.hits_by_severity(severity))
        return hits

    def labels_statistics(self):
        """Compute statistics on labels"""
        statistics = {}
        for assessment in self.assessment_set.all() :
            for hit in assessment.displayable_hits():
                for label in hit.labels.all():
                    if statistics.get(label.title) is None :
                        statistics[label.title] = 1
                    else:
                        statistics[label.title] = statistics[label.title] + 1
        return statistics

    def get_viewable(user):
        """Returns all viewable & non-archived projects"""
        return Project.objects.filter(Q(pentesters__in=[user]) | Q(viewers__in=[user])).filter(archived = False).distinct()

    def get_archived_viewable(user):
        """Returns all viewable & non-archived projects"""
        return Project.objects.filter(Q(pentesters__in=[user]) | Q(viewers__in=[user])).filter(archived = True).distinct()  

    def is_user_can_view(self, user):
        """Verify if the user have read access for this project"""
        result = False
        if user in self.pentesters.all() or user in self.viewers.all() :
            result = True
        return result

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this project"""
        result = False
        if user in self.pentesters.all() :
            result = True
        return result

    def is_user_can_create(self, user):
        """Verify if the user can create this project"""
        return True

    class Meta:
        ordering = ('name',)

"""Attack Scenario model."""
class AttackScenario(models.Model):

    project = models.ForeignKey(Project, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    scenario = models.TextField(blank=True, default="")
    svg = models.TextField(blank=True, default="")
    body = models.TextField(blank=True, default="")
    
    def __str__(self):  
        return self.scenario

    def get_viewable(user):
        """Returns all viewable attack scenarios"""
        return AttackScenario.objects.filter(project__in=Project.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this attack scenario"""
        return self.project.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this attack scenario"""
        return self.project.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this attack scenario"""
        return self.project.is_user_can_edit(user)

    class Meta:
        ordering = ('name',)

"""Recommendation model."""
class Recommendation(models.Model):

    project = models.ForeignKey(Project, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000, default="")
    body = models.TextField(blank=True, default="")
    
    def get_viewable(user):
        """Returns all viewable recommendations"""
        return Recommendation.objects.filter(project__in=Project.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this recommendation"""
        return self.project.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this recommendation"""
        return self.project.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this recommendation"""
        return self.project.is_user_can_edit(user)

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('name',)

"""Assesment model."""
class Assessment(models.Model):

    name = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)

    def __str__(self):  
        return self.name

    def displayable_hits(self):
        return self.hit_set.filter(displayable = True)

    def p1_hits(self):
        """Return all P1 hits for the assessment."""
        return self.hits_by_severity(1)

    def p2_hits(self):
        """Return all P2 hits for the assessment."""
        return self.hits_by_severity(2)

    def p3_hits(self):
        """Return all P3 hits for the assessment."""
        return self.hits_by_severity(3)

    def p4_hits(self):
        """Return all P4 hits for the assessment."""
        return self.hits_by_severity(4)

    def p5_hits(self):
        """Return all P5 hits for the assessment."""
        return self.hits_by_severity(5)

    def hits_by_severity(self, severity):
        """Filter hits by severity for the assessment."""
        hits = []
        for hit in self.hit_set.filter(severity = severity).filter(displayable = True).all() :
            hits.append(hit)
        return hits

    def open_flags(self):
        """Return all open flags for the assessment."""
        return self.flag_set.filter(done = False)

    def get_viewable(user):
        """Returns all viewable assessments"""
        return Assessment.objects.filter(project__in=Project.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this assessment"""
        return self.project.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this assessment"""
        return self.project.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this assessment"""
        return self.project.is_user_can_edit(user)

    class Meta:
        ordering = ('name',)


"""Label model."""
class Label(models.Model):

    title = models.CharField(max_length=200)
    color = models.CharField(max_length=7)
    deprecated = models.BooleanField(default=False)

    def __str__(self):  
        return self.title

    def get_viewable(user):
        """Returns all viewable labels"""
        return Label.objects.all()

    def get_not_deprecated(user):
        """Returns not deprecated labels"""
        return Label.objects.filter(deprecated=False)

    def is_user_can_view(self, user):
        """Verify if the user have read access for this label"""
        return True

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this label"""
        return user.is_staff

    def is_user_can_create(self, user):
        """Verify if the user can create this label"""
        return user.is_staff

    class Meta:
        ordering = ('pk',)

"""CvssV3.1 model"""
class Cvss3(models.Model):
    NALP_CHOICES = (
        ('N', 'Network'),
        ('A', 'Adjacent'),
        ('L', 'Local'),
        ('P', 'Physical')
    )

    LH_CHOICES = (
        ('L', 'Low'),
        ('H', 'High')
    )

    NLH_CHOICES = (
        ('N', 'None'),
        ('L', 'Low'),
        ('H', 'High')
    )

    NR_CHOICES = (
        ('N', 'None'),
        ('R', 'Required')
    )

    UC_CHOICES = (
        ('U', 'Unchanged'),
        ('C', 'Changed')
    )

    """CVSS String values"""
    attack_vector = models.CharField(max_length=1,choices=NALP_CHOICES)
    attack_complexity = models.CharField(max_length=1,choices=LH_CHOICES)
    privilege_required = models.CharField(max_length=1,choices=NLH_CHOICES)
    user_interaction = models.CharField(max_length=1,choices=NR_CHOICES)
    scope = models.CharField(max_length=1,choices=UC_CHOICES)
    confidentiality = models.CharField(max_length=1,choices=NLH_CHOICES)
    integrity = models.CharField(max_length=1,choices=NLH_CHOICES)
    availability = models.CharField(max_length=1,choices=NLH_CHOICES)

    """Values for usage"""
    decimal_value = models.DecimalField(max_digits=3, decimal_places=1, default=-1.0)

    def compute_cvss_value(self) :
        c = CVSS3(self.get_cvss_string())
        self.decimal_value = c.base_score

    def get_cvss_string(self):
        """Return the string value of the cvss"""
        return "CVSS:3.1/AV:" + self.attack_vector + "/AC:" + self.attack_complexity + "/PR:" + self.privilege_required + "/UI:" + self.user_interaction + "/S:" + self.scope + "/C:" + self.confidentiality + "/I:" + self.integrity + "/A:" + self.availability 

    class Meta:
        ordering = ('decimal_value',)

"""CvssV4.0 model"""
class Cvss4(models.Model):
    NALP_CHOICES = (
        ('N', 'Network'),
        ('A', 'Adjacent'),
        ('L', 'Local'),
        ('P', 'Physical')
    )

    LH_CHOICES = (
        ('L', 'Low'),
        ('H', 'High')
    )

    NP_CHOICES = (
        ('N', 'None'),
        ('P', 'Present')
    )

    NLH_CHOICES = (
        ('N', 'None'),
        ('L', 'Low'),
        ('H', 'High')
    )

    NPA_CHOICES = (
        ('N', 'None'),
        ('P', 'Passive'),
        ('A', 'Active')
    )

    """CVSS4 String values"""
    attack_vector = models.CharField(max_length=1,choices=NALP_CHOICES)
    attack_complexity = models.CharField(max_length=1,choices=LH_CHOICES)
    attack_requirements = models.CharField(max_length=1,choices=NP_CHOICES)
    privilege_required = models.CharField(max_length=1,choices=NLH_CHOICES)
    user_interaction = models.CharField(max_length=1,choices=NPA_CHOICES)
    confidentiality = models.CharField(max_length=1,choices=NLH_CHOICES)
    integrity = models.CharField(max_length=1,choices=NLH_CHOICES)
    availability = models.CharField(max_length=1,choices=NLH_CHOICES)
    subsequent_confidentiality = models.CharField(max_length=1,choices=NLH_CHOICES)
    subsequent_integrity = models.CharField(max_length=1,choices=NLH_CHOICES)
    subsequent_availability = models.CharField(max_length=1,choices=NLH_CHOICES)

    """Values for usage"""
    decimal_value = models.DecimalField(max_digits=3, decimal_places=1, default=-1.0)

    def compute_cvss_value(self) :
        c = CVSS4(self.get_cvss_string())
        self.decimal_value = c.base_score

    def get_cvss_string(self):
        """Return the string value of the cvss"""
        return "CVSS:4.0/AV:" + self.attack_vector + "/AC:" + self.attack_complexity + "/AT:" + self.attack_requirements + "/PR:" + self.privilege_required + "/UI:" + self.user_interaction + "/VC:" + self.confidentiality + "/VI:" + self.integrity + "/VA:" + self.availability + "/SC:" + self.subsequent_confidentiality + "/SI:" + self.subsequent_integrity + "/SA:" + self.subsequent_availability 

    class Meta:
        ordering = ('decimal_value',)

"""Hit model."""
class Hit(models.Model):

    title = models.CharField(max_length=200)
    body = models.TextField(blank=True, default="")
    remediation = models.TextField(blank=True, default="")
    asset = models.CharField(blank=True, max_length=256, default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    fix_complexity = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(3)])
    displayable = models.BooleanField(default=True)
    cvss3 = models.OneToOneField(Cvss3, null=True, on_delete=models.SET_NULL)
    cvss4 = models.OneToOneField(Cvss4, null=True, on_delete=models.SET_NULL)
    labels = models.ManyToManyField(Label)

    def __str__(self):  
        return self.title

    def get_viewable(user):
        """Returns all viewable hits"""
        return Hit.objects.filter(assessment__in=Assessment.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this hit"""
        return self.assessment.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this hit"""
        return self.assessment.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this hit"""
        return self.assessment.is_user_can_edit(user)

    def get_unique_id(self):
        """Return a pretty value of the ID, ex: PTART-2022-<id>"""
        return "PTART-" + str(self.added.year) + "-" + str(self.id).zfill(5)

    def get_fix_complexity_str(self) :
        value = "N/D"
        if self.fix_complexity == 1 :
            value = "Hard"
        elif self.fix_complexity == 2 :
            value = "Moderate"
        elif self.fix_complexity == 3 :
            value = "Easy"
        return value

    def get_cvss_value(self):
        """Return the decimal value of the cvss"""
        match self.assessment.project.cvss_type :
            case 3:
                if self.cvss3 is None :
                    return "---"
                else : 
                    return self.cvss3.decimal_value
            case 4:
                if self.cvss4 is None :
                    return "---"
                else : 
                    return self.cvss4.decimal_value

    def get_cvss_string(self):
        """Return the string value of the cvss"""
        match self.assessment.project.cvss_type :
            case 3:
                if self.cvss3 is None :
                    return ""
                else : 
                    return self.cvss3.get_cvss_string() 
            case 4:
                if self.cvss4 is None :
                    return ""
                else : 
                    return self.cvss4.get_cvss_string() 

    def delete(self, *args, **kwargs):
        if self.cvss3:
            self.cvss3.delete()
        if self.cvss4:
            self.cvss4.delete()
        return super(self.__class__, self).delete(*args, **kwargs)

    class Meta:
        ordering = ('severity', '-cvss3','-cvss4', 'title',)

"""Comment model."""
class Comment(models.Model):

    hit = models.ForeignKey(Hit, null=True, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000, default="")
    author = models.ForeignKey(User, null=True, on_delete=models.PROTECT)
    added = models.DateTimeField(default=datetime.now)
    
    def get_viewable(user):
        """Returns all viewable comments"""
        return Comment.objects.filter(hit__in=Hit.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this comment"""
        return self.hit.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this comment"""
        return self.hit.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this comment"""
        return self.hit.is_user_can_edit(user)

    def __str__(self):  
        return self.text

    class Meta:
        ordering = ('added',)

"""HitReference model."""
class HitReference(models.Model):

    hit = models.ForeignKey(Hit, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=1000, default="")
    url = models.CharField(max_length=1000, default="")
    
    def get_viewable(user):
        """Returns all viewable hit references"""
        return HitReference.objects.filter(hit__in=Hit.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this hit reference"""
        return self.hit.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this hit reference"""
        return self.hit.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this hit reference"""
        return self.hit.is_user_can_edit(user)

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('name',)


"""Screenshot model."""
class Screenshot(models.Model):

    upload_folder = 'screenshots'

    hit = models.ForeignKey(Hit, null=True, on_delete=models.CASCADE)
    screenshot = models.ImageField(upload_to=upload_folder)
    caption = models.CharField(blank=True, max_length=256, default="")
    
    def get_data(self):
        """Get screenshot data in Base64"""
        encoded_string = ''
        extension = os.path.splitext(self.screenshot.url)[1]
        url = self.screenshot.url
        if url.startswith('.') is False :
            url = "." + url
        with open(url, 'rb') as img_f:
            encoded_string = base64.b64encode(img_f.read())
        return 'data:image/%s;base64,%s' % (extension,encoded_string.decode("utf-8"))

    def get_raw_data(self):
        """Get screenshot data in binary format"""
        result = ''
        url = self.screenshot.url
        if url.startswith('.') is False :
            url = "." + url
        with open(url, 'rb') as img_f:
            result = img_f.read()
        return result

    def delete(self):
        """Delete file related to the screenshot"""
        url = self.screenshot.url
        if url.startswith('.') is False :
            url = "." + url
        os.remove(url)
        super(Screenshot, self).delete()
    
    def get_viewable(user):
        """Returns all viewable screenshots"""
        return Screenshot.objects.filter(hit__in=Hit.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this screenshot"""
        return self.hit.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this screenshot"""
        return self.hit.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this screenshot"""
        return self.hit.is_user_can_edit(user)

    def __str__(self):  
        return self.screenshot


"""Attachment model."""
class Attachment(models.Model):

    upload_folder = 'attachments'

    hit = models.ForeignKey(Hit, null=True, on_delete=models.CASCADE)
    attachment_name = models.CharField(max_length=100, default="")
    attachment = models.FileField(upload_to=upload_folder)

    def get_data(self):
        """Get attachment data in Base64"""
        encoded_string = ''
        url = self.attachment.url
        if url.startswith('.') is False :
            url = "." + url
        with open(url, 'rb') as file_f:
            encoded_string = base64.b64encode(file_f.read())
        return 'data:application/octet;base64,%s' % (encoded_string.decode("utf-8"))

    def get_raw_data(self):
        """Get attachment data in binary format"""
        result = ''
        url = self.attachment.url
        if url.startswith('.') is False :
            url = "." + url
        with open(url, 'rb') as file_f:
            result = file_f.read()
        return result
    
    def delete(self):
        """Delete file related to the attachment"""
        url = self.attachment.url
        if url.startswith('.') is False :
            url = "." + url
        os.remove(url)
        super(Attachment, self).delete()
    
    def get_viewable(user):
        """Returns all viewable attachments"""
        return Attachment.objects.filter(hit__in=Hit.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this attachment"""
        return self.hit.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this attachment"""
        return self.hit.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this attachment"""
        return self.hit.is_user_can_edit(user)

    def __str__(self):  
        return self.attachment


"""Flag model."""
class Flag(models.Model):

    title = models.CharField(max_length=100)
    note = models.TextField(blank=True, default="")
    asset = models.CharField(blank=True, max_length=256, default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    done = models.BooleanField(default=False)
    added = models.DateTimeField(default=datetime.now)
    assignee = models.ForeignKey(User, null=True, on_delete=models.PROTECT)

    def __str__(self):  
        return self.title

    def get_viewable(user):
        """Returns all viewable flags"""
        return Flag.objects.filter(assessment__in=Assessment.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this flag"""
        return self.assessment.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this flag"""
        return self.assessment.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this flag"""
        return self.assessment.is_user_can_edit(user)

    class Meta:
        ordering = ('title',)


"""Template model."""
class Template(models.Model):
    name = models.CharField(max_length=100)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    body = models.TextField(blank=True, default="")
    remediation = models.TextField(blank=True, default="")
    asset = models.CharField(blank=True, max_length=256, default="")
    owner = models.ForeignKey(User, null=True, blank=True, default=None, on_delete=models.PROTECT)

    def __str__(self):  
        return self.name

    def get_viewable(user):
        """Returns all viewable templates"""
        templates = None
        if user.is_staff :
            templates = Template.objects.all()
        else :
            templates = Template.objects.filter(Q(owner=None) | Q(owner=user))
        return templates

    def get_usable(user):
        """Returns all templates that should be usable for hit creation"""
        return Template.objects.filter(Q(owner=None) | Q(owner=user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this template"""
        return user.is_staff or (self.owner is None or self.owner == user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this template"""
        return user.is_staff or self.owner == user

    def is_user_can_create(self, user):
        """Verify if the user can create this template"""
        return user.is_staff or self.owner == user

    class Meta:
        ordering = ('name',)


"""Severity structure."""
class Severity():
    values = [1,2,3,4,5]

#-----------------------------------------------------------------------------#
# ASSET MANAGEMENT                                                           #
#-----------------------------------------------------------------------------#

"""Host model."""
class Host(models.Model):

    project = models.ForeignKey(Project, null=True, on_delete=models.CASCADE)
    hostname = models.CharField(max_length=100, default="")
    ip = models.CharField(max_length=100, blank=True, default="")
    os = models.CharField(max_length=100, blank=True, default="")
    notes = models.CharField(max_length=1000, blank=True, default="")
    
    def get_viewable(user):
        """Returns all viewable hosts"""
        return Host.objects.filter(project__in=Project.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this host"""
        return self.project.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this host"""
        return self.project.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this host"""
        return self.project.is_user_can_edit(user)

    def __str__(self):  
        return self.hostname + " - " + self.ip

    class Meta:
        ordering = ('hostname',)


"""Service model."""
class Service(models.Model):

    host = models.ForeignKey(Host, null=True, on_delete=models.CASCADE)
    port = models.IntegerField(default=0)
    protocol = models.CharField(max_length=200, blank=True, default="")
    name = models.CharField(max_length=200, blank=True, default="")
    version = models.CharField(max_length=100, blank=True, default="")
    banner = models.CharField(max_length=1000, blank=True, default="")
    
    def get_viewable(user):
        """Returns all viewable Services"""
        return Host.objects.filter(host__in=Host.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this host"""
        return self.host.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this host"""
        return self.host.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this host"""
        return self.host.is_user_can_edit(user)

    def __str__(self):  
        return self.hostname + " - " + self.ip

    class Meta:
        ordering = ('port',)