import json
import os
import django

#
# Common tools loader.
#

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptart.settings")
django.setup()

from ptart.models import Tool

common_tools_file = open("data/common_tools.json", "r")
tool_json = json.load(common_tools_file)
for tool in tool_json["tools"]:
    new_tool = Tool(name=tool["name"], url=tool["url"])
    new_tool.save()
print("Common tools has been imported !")
