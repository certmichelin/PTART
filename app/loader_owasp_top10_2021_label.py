import json
import os
import django

#
# OWASP 2021 Top 10 labels loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptart.settings")
django.setup()

from ptart.models import Label

owasp_file = open("data/owasp_top10_2021_label.json", "r")
label_json = json.load(owasp_file)
for label in label_json["labels"]:
    new_label = Label(title=label["title"], color=label["color"])
    new_label.save()
print("OWASP 2021 Top 10 labels has been imported !")
