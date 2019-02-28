from django.contrib import admin

from .models import Project, Assessment, Sh0t, Flag, Template, Screenshot, MethodologyMaster, ModuleMaster, CaseMaster


"""MethodologyMasterAdmin class."""
class MethodologyMasterAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'order']
    list_display = ['name', 'description', 'order']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']


"""MethodologyMasterAdmin class."""
class ModuleMasterAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'methodology',  'order']
    list_display = ['name', 'description', 'methodology', 'order']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']


"""MethodologyMasterAdmin class."""
class CaseMasterAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'module', 'order']
    list_display = ['name', 'description', 'module', 'methodology', 'order']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']

    @staticmethod
    def methodology(case):
        return case.module.methodology

"""Register all classes for admin."""
admin.site.register(Project)
admin.site.register(Assessment)
admin.site.register(Sh0t)
admin.site.register(Screenshot)
admin.site.register(Flag)
admin.site.register(Template)
admin.site.register(MethodologyMaster, MethodologyMasterAdmin)
admin.site.register(ModuleMaster, ModuleMasterAdmin)
admin.site.register(CaseMaster, CaseMasterAdmin)