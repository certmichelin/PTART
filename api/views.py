from rest_framework import status
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.renderers import BaseRenderer
from rest_framework.response import Response

from app.models import Flag, Sh0t, Assessment, Project, Template, Screenshot
from configuration.models import CaseMaster, ModuleMaster, MethodologyMaster

from .serializers import FlagSerializer, Sh0tSerializer, AssessmentSerializer, ProjectSerializer, TemplateSerializer, ScreenshotSerializer
from .serializers import CaseMasterSerializer, ModuleMasterSerializer, MethodologyMasterSerializer


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def flag(request, pk):
    return item(request, pk, Flag, FlagSerializer)

@api_view(['GET', 'POST'])
def flags(request):
    return items(request, Flag, FlagSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def sh0t(request, pk):
    return item(request, pk, Sh0t, Sh0tSerializer)

@api_view(['GET', 'POST'])
def sh0ts(request):
    return items(request, Sh0t, Sh0tSerializer)
    
@api_view(['DELETE'])
def screenshot(request, pk):
    return item(request, pk, Screenshot, ScreenshotSerializer)

@api_view(['GET', 'POST'])
def screenshots(request):
    return items(request, Screenshot, ScreenshotSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def assessment(request, pk):
    return item(request, pk, Assessment, AssessmentSerializer)
    
@api_view(['GET', 'POST'])
def assessments(request):
    return items(request, Assessment, AssessmentSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def project(request, pk):
    return item(request, pk, Project, ProjectSerializer)

@api_view(['GET', 'POST'])
def projects(request):
    return items(request, Project, ProjectSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def template(request, pk):
    return item(request, pk, Template, TemplateSerializer)
    
@api_view(['GET', 'POST'])
def templates(request):
    return items(request, Template, TemplateSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def case_master(request, pk):
    return item(request, pk, CaseMaster, CaseMasterSerializer)
    
@api_view(['GET', 'POST'])
def case_masters(request):
    return items(request, CaseMaster, CaseMasterSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def module_master(request, pk):
    return item(request, pk, ModuleMaster, ModuleMasterSerializer)
    
@api_view(['GET', 'POST'])
def module_masters(request):
    return items(request, ModuleMaster, ModuleMasterSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def methodology_master(request, pk):
    return item(request, pk, MethodologyMaster, MethodologyMasterSerializer)

@api_view(['GET', 'POST'])
def methodology_masters(request):
    return items(request, MethodologyMaster, MethodologyMasterSerializer)

@action(methods=['GET'], detail=True)
def screenshot_raw(request, pk) :
    response = None
    try:
        item = Screenshot.objects.get(pk=pk)
        response = Response(item.get_raw_data())
    except Screenshot.DoesNotExist:
        response = Response()

    response.accepted_renderer = ImageRenderer()
    response.accepted_media_type = 'image/png'
    response.renderer_context = {}
    return response

#
# CRUD operations for a specific item.
#
def item(request, pk, class_name, serializer_name) :
    response = None
    try:
        item = class_name.objects.get(pk=pk)

        if request.method == 'GET':
            response = Response(serializer_name(item).data)

        elif request.method == 'PUT' or request.method == 'PATCH':
            serializer = serializer_name(item, data=request.data)
            if serializer.is_valid():
                serializer.save()
                response = Response(serializer.data)
            else :
                response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            item.delete()
            response = Response(status=status.HTTP_204_NO_CONTENT)

    except class_name.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)

    return response

#
# CRUD operations for a specific list of items.
#
def items(request, class_name, serializer_name) :
    response = None
    if request.method == 'GET':
        response = Response(serializer_name(class_name.objects.all(), many=True).data)

    elif request.method == 'POST':
        serializer = serializer_name(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = Response(serializer.data, status=status.HTTP_201_CREATED)
        else :
            response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return response

#
# Image renderer for Screenshots.
#
class ImageRenderer(BaseRenderer):
    def render(self, data, media_type='image/png', renderer_context=None):
        return data