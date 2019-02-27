import base64
import os.path
import uuid

from django.db import models
from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible
class Project(models.Model):
    name = models.CharField(max_length=100)
    scope = models.TextField(default="")
    added = models.DateTimeField(default=datetime.now)

    def __str__(self):  # __unicode__ on Python 2
        return self.name

    def p1_sh0ts(self):
        return self.sh0ts_by_severity(1)
    
    def p2_sh0ts(self):
        return self.sh0ts_by_severity(2)

    def p3_sh0ts(self):
        return self.sh0ts_by_severity(3)

    def p4_sh0ts(self):
        return self.sh0ts_by_severity(4)

    def p5_sh0ts(self):
        return self.sh0ts_by_severity(5)

    def sh0ts_by_severity(self, severity):
        sh0ts = []
        for assessment in self.assessment_set.all() :
            sh0ts.extend(assessment.sh0ts_by_severity(severity))
        return sh0ts

    class Meta:
        ordering = ('name',)


@python_2_unicode_compatible
class Assessment(models.Model):
    name = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)

    def __str__(self):  # __unicode__ on Python 2
        return self.name

    def p1_sh0ts(self):
        return self.sh0ts_by_severity(1)
    
    def p2_sh0ts(self):
        return self.sh0ts_by_severity(2)

    def p3_sh0ts(self):
        return self.sh0ts_by_severity(3)

    def p4_sh0ts(self):
        return self.sh0ts_by_severity(4)

    def p5_sh0ts(self):
        return self.sh0ts_by_severity(5)

    def sh0ts_by_severity(self, severity):
        sh0ts = []
        for sh0t in self.sh0t_set.filter(severity = severity).all() :
            sh0ts.append(sh0t)
        return sh0ts

    def open_flags(self):
        return self.flag_set.filter(done = False)

    class Meta:
        ordering = ('name',)


@python_2_unicode_compatible
class Sh0t(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField(default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    added = models.DateTimeField(default=datetime.now)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):  # __unicode__ on Python 2
        return self.title

    class Meta:
        ordering = ('severity','title',)


@python_2_unicode_compatible
class Screenshot(models.Model):
    sh0t = models.ForeignKey(Sh0t, null=True, on_delete=models.CASCADE)
    screenshot = models.ImageField(upload_to='screenshots')

    def get_data(self):
        encoded_string = ''
        extension = os.path.splitext(self.screenshot.url)[1]
        with open(self.screenshot.url, 'rb') as img_f:
            encoded_string = base64.b64encode(img_f.read())
        return 'data:image/%s;base64,%s' % (extension,encoded_string.decode("utf-8"))

    def get_raw_data(self):
        result = ''
        extension = os.path.splitext(self.screenshot.url)[1]
        with open(self.screenshot.url, 'rb') as img_f:
            result = img_f.read()
        return result

    def create_screenshot(screenshot, sh0t):
        decoded_string = ''
        extension= screenshot.split(';')[0].split('/')[1]
        b64_data = screenshot.split(',')[1]
        file = "screenshots/{}.{}".format(uuid.uuid4(),extension)
        with open(file, 'wb') as img_f:
            img_f.write(base64.b64decode(b64_data))
        screenshot_created = Screenshot.objects.create(screenshot=file,sh0t=sh0t)
        screenshot_created.save()
        return screenshot_created.save()

    def __str__(self):  # __unicode__ on Python 2
        return self.screenshot

@python_2_unicode_compatible
class Flag(models.Model):
    title = models.CharField(max_length=100)
    note = models.TextField(default="")
    assessment = models.ForeignKey(Assessment, null=True, on_delete=models.CASCADE)
    done = models.BooleanField(default=False)
    added = models.DateTimeField(default=datetime.now)
    order = models.IntegerField(default=1)

    def __str__(self):  # __unicode__ on Python 2
        return self.title

    class Meta:
        ordering = ('title',)


@python_2_unicode_compatible
class Template(models.Model):
    name = models.CharField(max_length=100)
    severity = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    body = models.TextField(default="")

    def __str__(self):  # __unicode__ on Python 2
        return self.name

    class Meta:
        ordering = ('severity','name',)

