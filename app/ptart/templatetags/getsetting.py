from django import template
from django.conf import settings

register = template.Library()


@register.filter
def getsetting(name):
    return getattr(settings, name, "")
