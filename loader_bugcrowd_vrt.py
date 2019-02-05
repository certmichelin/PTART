import json
import os
import django

#
# Bugcrowd VRT templates loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sh00t.settings")
django.setup()

from app.models import Template

bugcrowd_file = open('configuration/data/vulnerability-rating-taxonomy.json', 'r')
vrt = json.load(bugcrowd_file)
for content in vrt['content'] :
    name = content['name']
    for child in content['children'] :
        child_name = child["name"]
        if 'children' in child :
            for little_child in child['children'] :
                little_child_name = little_child ["name"]
                if severity is None :
                    severity = 3
                name = "{} ({}) ({})".format(name, child_name, little_child_name)
                current_template = Template.objects.filter(name=name)
                if not current_template :
                    template = Template(name=name, severity = severity)
                    template.save()
        else :
            severity = child["priority"]
            if severity is None :
                severity = 3
            name = "{} ({})".format(name, child_name)
            current_template = Template.objects.filter(name=name)
            if not current_template :
                template = Template(name=name, severity = severity)
                template.save()
print("Bugcrowd VRT templates has been imported !")
