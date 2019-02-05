import json
import os
import django

#
# WAAH Methodology loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sh00t.settings")
django.setup()

from configuration.models import MethodologyMaster, ModuleMaster, CaseMaster

current_methodology = MethodologyMaster.objects.filter(name="WAHH")
if not current_methodology :
    methodology_master = MethodologyMaster(name="WAHH")
    methodology_master.save()
    wahh_file = open('configuration/data/wahh.json',  'rt', encoding='latin1')
    methodology = json.load(wahh_file)

    for method in methodology['checklist']['Functionality']:
        module_master = ModuleMaster(name=method, methodology=methodology_master, order=methodology['checklist']['Functionality'][method]['order'])
        module_master.save()
        for case in methodology['checklist']['Functionality'][method]['tests']:
            order = '1' + str(methodology['checklist']['Functionality'][method]['order']) + str(methodology['checklist']['Functionality'][method]['tests'][case]['order'])
            descriptions_json = methodology['checklist']['Functionality'][method]['tests'][case]['description']
            description_consolidated = ""
            for description in descriptions_json:
                description_consolidated = description_consolidated + description + '\n\n'
            case = CaseMaster(name=case, description=description_consolidated, module=module_master, order=order)
            case.save()
    print("Waah methodology has been imported !")
else :
    print("Waah methodology was already present in Sh00t!. No changes has been made.")
