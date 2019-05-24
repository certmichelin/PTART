import json
import os
import django

#
# WAAH Methodology loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptart.settings")
django.setup()

from ptart.models import Methodology, Module, Case

current_methodology = Methodology.objects.filter(name="WAHH")
if not current_methodology :
    methodology = Methodology(name="WAHH")
    methodology.save()
    wahh_file = open('data/wahh.json',  'rt', encoding='latin1')
    methodology_json = json.load(wahh_file)

    for method in methodology_json['checklist']['Functionality']:
        module = Module(name=method, methodology=methodology)
        module.save()
        for case in methodology_json['checklist']['Functionality'][method]['tests']:
            descriptions_json = methodology_json['checklist']['Functionality'][method]['tests'][case]['description']
            description_consolidated = ""
            for description in descriptions_json:
                description_consolidated = description_consolidated + description + '\n\n'
            case = Case(name=case, description=description_consolidated, module=module)
            case.save()
    print("Waah methodology has been imported !")
else :
    print("Waah methodology was already present in PTART!. No changes has been made.")
