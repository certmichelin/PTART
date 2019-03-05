from django import template                                                                                                                                                        
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter
@stringfilter
def split(s):
    return s.split(',')