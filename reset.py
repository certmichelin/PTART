import json
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sh00t.settings")
django.setup()

from sh00t.models import Project, Template, Methodology, Module, Case

print("This will reset everything in the database and set up as fresh.")
print("Are you wanna do this?")
answer = input("[No] | Yes?\n") or ""
if "yes" == answer.lower():

    Project.objects.all().delete()  # Deleting Project will trigger to delete everything: Flags, Sh0ts, Assessments, Screenshots
    Case.objects.all().delete()
    Module.objects.all().delete()
    Methodology.objects.all().delete()
    Template.objects.all().delete()
