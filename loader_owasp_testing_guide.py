import json
import os
import django

#
# OWASP testing guide v4 Methodology loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sh00t.settings")
django.setup()

from sh00t.models import Methodology, Module, Case

current_methodology = Methodology.objects.filter(name="OWASP Testing Guide V4")
if not current_methodology :
    methodology = Methodology(name="OWASP Testing Guide V4")
    methodology.save()
    owasp_file = open('data/owasp_testing_guide_v4.json', 'r')
    methodology_json = json.load(owasp_file)
    for method in methodology_json['modules']:
        module = Module(name=method, methodology=methodology)
        module.save()
        for case in methodology_json['modules'][method]['tests']:
            steps = methodology_json['modules'][method]['tests'][case]['steps']
            steps_consolidated = ""
            for step in steps:
                steps_consolidated = steps_consolidated + step + '\n\n'
            case = Case(name=case, description=steps_consolidated, module=module)
            case.save()
    print("OWASP Testing Guide V4 methodology has been imported !")
else :
    print("OWASP Testing Guide V4 methodology was already present in Sh00t!. No changes has been made.")
