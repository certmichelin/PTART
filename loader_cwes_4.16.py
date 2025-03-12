import json
import os
import django
import xml.etree.ElementTree as ET

#
# Bugcrowd VRT templates loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptart.settings")
django.setup()

from ptart.models import CWE, CWEs

cwes = CWEs(version="v4.16")
cwes.save()

tree = ET.parse('data/cwec_v4.16.xml')
weaknesses = tree.getroot().find("{http://cwe.mitre.org/cwe-7}Weaknesses")
for weakness in weaknesses:
    
    extended_description = ""
    if weakness.find("{http://cwe.mitre.org/cwe-7}Extended_Description") is not None:
        extended_description = weakness.find("{http://cwe.mitre.org/cwe-7}Extended_Description").text
        if extended_description is None:
            extended_description = weakness.find("{http://cwe.mitre.org/cwe-7}Extended_Description").find("{http://www.w3.org/1999/xhtml}p").text

    cwe = CWE(cwes=cwes, 
                cwe_id=weakness.attrib['ID'], 
                name=weakness.attrib['Name'], 
                description=weakness.find("{http://cwe.mitre.org/cwe-7}Description").text, 
                extended_description=extended_description)
    cwe.save()
print("CWE v4.16 : {} CWEs imported !".format(len(weaknesses)))