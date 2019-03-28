import base64
import os
import uuid

from datetime import datetime
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


""" Project model."""
class Project(models.Model):

    name = models.CharField(max_length=100)
    scope = models.TextField(blank=True, default="")
    added = models.DateTimeField(default=datetime.now)
    pentesters = models.ManyToManyField(User)

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
        return Project.objects.filter(pentesters__in=[user])

    def is_user_can_view(self, user):
        """Verify if the user have read access for this project"""
        result = False
        if user in self.pentesters.all() :
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
        return True

    def is_user_can_create(self, user):
        """Verify if the user can create this label"""
        return True

    class Meta:
        ordering = ('pk',)


"""Sh0t model."""
class Sh0t(models.Model):

    title = models.CharField(max_length=200)
    body = models.TextField(blank=True, default="")
    asset = models.CharField(blank=True, max_length=256, default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    cvss = models.CharField(max_length=4, default="---")
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
        return True

    def is_user_can_create(self, user):
        """Verify if the user can create this template"""
        return True

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
        return True

    def is_user_can_create(self, user):
        """Verify if the user can create this methodology"""
        return True

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
        return True

    def is_user_can_create(self, user):
        """Verify if the user can create this module"""
        return True

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
        return True

    def is_user_can_create(self, user):
        """Verify if the user can create this case"""
        return True

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('name',)

"""Severity structure."""
class Severity():
    values = [1,2,3,4,5]

