import base64
import math
import os
import uuid

from datetime import datetime
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q


""" Project model."""
class Project(models.Model):

    name = models.CharField(max_length=100)
    scope = models.TextField(blank=True, default="")
    added = models.DateTimeField(default=datetime.now)
    pentesters = models.ManyToManyField(User, related_name='%(class)s_pentesters')
    viewers = models.ManyToManyField(User, related_name='%(class)s_viewers')

    def __str__(self):  
        return self.name

    def p1_sh0ts(self):
        """Return all P1 sh0ts for the project."""
        return self.sh0ts_by_severity(1)
    
    def p2_sh0ts(self):
        """Return all P2 sh0ts for the project."""
        return self.sh0ts_by_severity(2)

    def p3_sh0ts(self):
        """Return all P3 sh0ts for the project."""
        return self.sh0ts_by_severity(3)

    def p4_sh0ts(self):
        """Return all P4 sh0ts for the project."""
        return self.sh0ts_by_severity(4)

    def p5_sh0ts(self):
        """Return all P5 sh0ts for the project."""
        return self.sh0ts_by_severity(5)

    def sh0ts_by_severity(self, severity):
        """Filter sh0ts by severity for the project."""
        sh0ts = []
        for assessment in self.assessment_set.all() :
            sh0ts.extend(assessment.sh0ts_by_severity(severity))
        return sh0ts

    def get_viewable(user):
        """Returns all viewable projects"""
        return Project.objects.filter(Q(pentesters__in=[user]) | Q(viewers__in=[user])) 

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


"""Assesment model."""
class Assessment(models.Model):

    name = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)

    def __str__(self):  
        return self.name

    def p1_sh0ts(self):
        """Return all P1 sh0ts for the assessment."""
        return self.sh0ts_by_severity(1)

    def p2_sh0ts(self):
        """Return all P2 sh0ts for the assessment."""
        return self.sh0ts_by_severity(2)

    def p3_sh0ts(self):
        """Return all P3 sh0ts for the assessment."""
        return self.sh0ts_by_severity(3)

    def p4_sh0ts(self):
        """Return all P4 sh0ts for the assessment."""
        return self.sh0ts_by_severity(4)

    def p5_sh0ts(self):
        """Return all P5 sh0ts for the assessment."""
        return self.sh0ts_by_severity(5)

    def sh0ts_by_severity(self, severity):
        """Filter sh0ts by severity for the assessment."""
        sh0ts = []
        for sh0t in self.sh0t_set.filter(severity = severity).all() :
            sh0ts.append(sh0t)
        return sh0ts

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

    def __str__(self):  
        return self.title

    def get_viewable(user):
        """Returns all viewable labels"""
        return Label.objects.all()

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

"""CvssV3 model"""
class Cvss(models.Model):
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

    def __round_up(self, n, decimals=0):
        multiplier = 10 ** decimals
        return math.ceil(n * multiplier) / multiplier

    def __get_cia_value(self,value) : 
        if value == "H":
            return 0.56
        elif value == "L":
            return  0.22
        else :
            return  0.0

    def __get_confidentiality_value(self) :
        return self.__get_cia_value(self.confidentiality)

    def __get_integrity_value(self) :
        return self.__get_cia_value(self.integrity)

    def __get_availability_value(self) :
        return self.__get_cia_value(self.availability)

    def __get_attack_vector_value(self) :
        if self.attack_vector == "N":
            return 0.85
        elif self.attack_vector == "A":
            return 0.62
        elif self.attack_vector == "L":
            return 0.55
        else :
            return 0.2

    def __get_attack_complexity_value(self) :
        if self.attack_complexity == "L" :
            return 0.77
        else :
            return 0.44

    def __get_privilege_required_value(self) :
        if self.privilege_required == "N" :
            return 0.85
        elif  self.privilege_required == "L" :
            if self.scope == "U" :
                return 0.62
            else :
                return 0.68
        else :
            if self.scope == "U" :
                return 0.27
            else :
                return 0.50
    
    def __get_user_interaction_value(self) :
        if self.user_interaction == "N" :
            return 0.85
        else :
            return 0.62

    def __get_exploitability(self) :
        return 8.22 * self.__get_attack_vector_value() * self.__get_attack_complexity_value() * self.__get_privilege_required_value() * self.__get_user_interaction_value()

    def __get_isc_base(self) :
        return 1.0 - ((1.0 - self.__get_confidentiality_value()) * (1.0 - self.__get_integrity_value()) * (1.0 - self.__get_availability_value()))

    def __get_isc(self, isc_base) :
        if self.scope == "U" :
            return 6.42 * isc_base
        else :
            return 7.52 * (isc_base - 0.029) - 3.25 * (isc_base - 0.02)**15

    def compute_cvss_value(self) :
        isc_base = self.__get_isc_base()
        isc = self.__get_isc(isc_base)
        exploitability = self.__get_exploitability()

        if isc > 0.0 :
            exploitability = self.__get_exploitability()
            if self.scope == "U" :
                self.decimal_value = self.__round_up(min(isc + exploitability, 10.0), 1)
            else :
                self.decimal_value = self.__round_up(min(1.08 * (isc + exploitability), 10.0), 1)
        else :
            self.decimal_value = 0.0

    class Meta:
        ordering = ('decimal_value',)


"""Sh0t model."""
class Sh0t(models.Model):

    title = models.CharField(max_length=200)
    body = models.TextField(blank=True, default="")
    asset = models.CharField(blank=True, max_length=256, default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    cvss = models.OneToOneField(Cvss, null=True, on_delete=models.SET_NULL)
    labels = models.ManyToManyField(Label)

    def __str__(self):  
        return self.title

    def get_viewable(user):
        """Returns all viewable sh0ts"""
        return Sh0t.objects.filter(assessment__in=Assessment.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this sh0t"""
        return self.assessment.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this sh0t"""
        return self.assessment.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this sh0t"""
        return self.assessment.is_user_can_edit(user)

    def get_cvss_value(self):
        """Return the decimal value of the cvss"""
        if self.cvss is None :
            return "---"
        else : 
            return self.cvss.decimal_value

    def get_cvss_string(self):
        """Return the string value of the cvss"""
        if self.cvss is None :
            return ""
        else : 
            return "CVSS:3.0/AV:" + self.cvss.attack_vector + "/AC:" + self.cvss.attack_complexity + "/PR:" + self.cvss.privilege_required + "/UI:" + self.cvss.user_interaction + "/S:" + self.cvss.scope + "/C:" + self.cvss.confidentiality + "/I:" + self.cvss.integrity + "/A:" + self.cvss.availability 

    def delete(self, *args, **kwargs):
        self.cvss.delete()
        return super(self.__class__, self).delete(*args, **kwargs)

    class Meta:
        ordering = ('severity', '-cvss', 'title',)


"""Screenshot model."""
class Screenshot(models.Model):

    upload_folder = 'screenshots'

    sh0t = models.ForeignKey(Sh0t, null=True, on_delete=models.CASCADE)
    screenshot = models.ImageField(upload_to=upload_folder)
    
    def get_data(self):
        """Get screenshot data in Base64"""
        encoded_string = ''
        extension = os.path.splitext(self.screenshot.url)[1]
        with open(self.screenshot.url, 'rb') as img_f:
            encoded_string = base64.b64encode(img_f.read())
        return 'data:image/%s;base64,%s' % (extension,encoded_string.decode("utf-8"))

    def get_raw_data(self):
        """Get screenshot data in binary format"""
        result = ''
        extension = os.path.splitext(self.screenshot.url)[1]
        with open(self.screenshot.url, 'rb') as img_f:
            result = img_f.read()
        return result

    def delete(self):
        """Delete file related to the screenshot"""
        os.remove(self.screenshot.url)
        super(Screenshot, self).delete()
    
    def get_viewable(user):
        """Returns all viewable screenshots"""
        return Screenshot.objects.filter(sh0t__in=Sh0t.get_viewable(user))

    def is_user_can_view(self, user):
        """Verify if the user have read access for this screenshot"""
        return self.sh0t.is_user_can_view(user)

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this screenshot"""
        return self.sh0t.is_user_can_edit(user)

    def is_user_can_create(self, user):
        """Verify if the user can create this screenshot"""
        return self.sh0t.is_user_can_edit(user)

    def __str__(self):  
        return self.screenshot


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
    asset = models.CharField(blank=True, max_length=256, default="")

    def __str__(self):  
        return self.name

    def get_viewable(user):
        """Returns all viewable templates"""
        return Template.objects.all()

    def is_user_can_view(self, user):
        """Verify if the user have read access for this template"""
        return True

    def is_user_can_edit(self, user):
        """Verify if the user have write access for this template"""
        return user.is_staff

    def is_user_can_create(self, user):
        """Verify if the user can create this template"""
        return user.is_staff

    class Meta:
        ordering = ('severity','name',)


"""Methodology model."""
class Methodology(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")

    def __str__(self):  
        return self.name

    def get_viewable(user):
        """Returns all viewable methodologies"""
        return Methodology.objects.all()

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
        ordering = ('name',)


"""Case model."""
class Case(models.Model):
    name = models.CharField(max_length=100)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
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
        ordering = ('name',)

"""Severity structure."""
class Severity():
    values = [1,2,3,4,5]

