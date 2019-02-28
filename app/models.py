import base64
import os
import uuid

from datetime import datetime
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


""" Project model."""
class Project(models.Model):

    name = models.CharField(max_length=100)
    scope = models.TextField(default="")
    added = models.DateTimeField(default=datetime.now)

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

    class Meta:
        ordering = ('name',)


"""Sh0t model."""
class Sh0t(models.Model):

    title = models.CharField(max_length=200)
    body = models.TextField(default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):  
        return self.title

    class Meta:
        ordering = ('severity','title',)


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

    def create_screenshot(screenshot, sh0t):
        """Create screenshot"""
        decoded_string = ''
        extension= screenshot.split(';')[0].split('/')[1]
        b64_data = screenshot.split(',')[1]
        file = "{}/{}.{}".format(self.upload_folder, uuid.uuid4(), extension)
        with open(file, 'wb') as img_f:
            img_f.write(base64.b64decode(b64_data))
        screenshot_created = Screenshot.objects.create(screenshot=file,sh0t=sh0t)
        screenshot_created.save()
        return screenshot_created.save()

    def __str__(self):  
        return self.screenshot


"""Flag model."""
class Flag(models.Model):

    title = models.CharField(max_length=100)
    note = models.TextField(default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    done = models.BooleanField(default=False)
    added = models.DateTimeField(default=datetime.now)

    def __str__(self):  
        return self.title

    class Meta:
        ordering = ('title',)


"""Flag model."""
class Template(models.Model):
    name = models.CharField(max_length=100)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    body = models.TextField(default="")

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('severity','name',)


"""MethodologyMaster model."""
class MethodologyMaster(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(default="")
    order = models.IntegerField(default=0)

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('name',)


"""ModuleMaster model."""
class ModuleMaster(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(default="")
    order = models.IntegerField(default=0)
    methodology = models.ForeignKey(MethodologyMaster, on_delete=models.CASCADE, null=True, default=None)

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('name',)


"""CaseMaster model."""
class CaseMaster(models.Model):
    name = models.CharField(max_length=100)
    module = models.ForeignKey(ModuleMaster, on_delete=models.CASCADE)
    description = models.TextField(default="")
    order = models.IntegerField(default=0)

    def __str__(self):  
        return self.name

    class Meta:
        ordering = ('name',)

