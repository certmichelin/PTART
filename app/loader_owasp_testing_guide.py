import json
import os
import django
import urllib.request

#
# OWASP testing guide v4 Methodology loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptart.settings")
django.setup()

from ptart.models import Methodology, Module, Case

current_methodology = Methodology.objects.filter(name="OWASP Testing Guide V4")
if not current_methodology:
    # Create Methodology.
    owasp_file = open("data/owasp_testing_guide_v4.json", "r")
    methodology_json = json.load(owasp_file)
    methodology = Methodology(
        name=methodology_json["name"], description=methodology_json["description"]
    )
    methodology.save()

    # Load modules and cases from OWAP Github repository
    response = urllib.request.urlopen(methodology_json["url"])
    owasp_json = json.loads(response.read())

    for category_key in owasp_json["categories"].keys():
        module_name = "{id} - {name}".format(
            id=owasp_json["categories"][category_key]["id"], name=category_key
        )
        module = Module(name=module_name, methodology=methodology)
        module.save()
        for test in owasp_json["categories"][category_key]["tests"]:
            case_name = "{id}: {name}".format(id=test["id"], name=test["name"])
            case_description = ""
            if len(test["objectives"]) > 1:
                for objective in test["objectives"]:
                    case_description = case_description + "* " + objective + "\n"
            elif len(test["objectives"]) == 1:
                case_description = test["objectives"][0]

            case = Case(
                name=case_name,
                description=case_description,
                reference=test["reference"],
                module=module,
            )
            case.save()

    print("OWASP Testing Guide V4 methodology has been imported !")
else:
    print(
        "OWASP Testing Guide V4 methodology was already present in PTART!. No changes has been made."
    )
