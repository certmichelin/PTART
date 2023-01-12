import json
import os
import django

#
# Common templates loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptart.settings")
django.setup()

from ptart.models import Template

common_templates_file = open('data/common_templates.json', 'r')
template_json = json.load(common_templates_file)
for template in template_json['templates']:
    new_template = Template(name=template["name"], severity=template["severity"], body=template["body"], remediation=template["remediation"])
    new_template.save()
print("Common templates has been imported !")
