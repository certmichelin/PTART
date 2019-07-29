from rest_framework import status
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.renderers import BaseRenderer
from rest_framework.response import Response

from ptart.models import Flag, Hit, Assessment, Project, Template, Screenshot, Attachment, Cvss, Case, Module, Methodology, Label

from .serializers import FlagSerializer, HitSerializer, AssessmentSerializer, ProjectSerializer, TemplateSerializer, ScreenshotSerializer, AttachmentSerializer, CvssSerializer, CaseSerializer, ModuleSerializer, MethodologySerializer, LabelSerializer


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def flag(request, pk):
    return item(request, pk, Flag, FlagSerializer)

@api_view(['GET', 'POST'])
def flags(request):
    return items(request, Flag, FlagSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def hit(request, pk):
    return item(request, pk, Hit, HitSerializer)

@api_view(['GET', 'POST'])
def hits(request):
    return items(request, Hit, HitSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def label(request, pk):
    return item(request, pk, Label, LabelSerializer)

@api_view(['GET', 'POST'])
def labels(request):
    return items(request, Label, LabelSerializer)
    
@api_view(['DELETE'])
def screenshot(request, pk):
    return item(request, pk, Screenshot, ScreenshotSerializer)

@api_view(['GET', 'POST'])
def screenshots(request):
    return items(request, Screenshot, ScreenshotSerializer)

@api_view(['DELETE'])
def attachment(request, pk):
    return item(request, pk, Attachment, AttachmentSerializer)

@api_view(['GET', 'POST'])
def attachments(request):
    return items(request, Attachment, AttachmentSerializer)

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
def case(request, pk):
    return item(request, pk, Case, CaseSerializer)
    
@api_view(['GET', 'POST'])
def cases(request):
    return items(request, Case, CaseSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def module(request, pk):
    return item(request, pk, Module, ModuleSerializer)
    
@api_view(['GET', 'POST'])
def modules(request):
    return items(request, Module, ModuleSerializer)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def methodology(request, pk):
    return item(request, pk, Methodology, MethodologySerializer)

@api_view(['GET', 'POST'])
def methodologies(request):
    return items(request, Methodology, MethodologySerializer)

@api_view(['POST'])
def load_module(request, pk, assessmentId):
    response = None
    try:
        assessment = Assessment.objects.get(pk=assessmentId)
        if assessment.is_user_can_edit(request.user) :
            module = Module.objects.get(pk=pk)
            cases = Case.objects.filter(module=module)
            flags = []
            for case in cases:
                note = "Module: " + module.name + "\n\n" + case.description
                flag = Flag(title=case.name, note=note, assessment=assessment, assignee = request.user)
                flag.save()
                flags.append(flag)
            response = Response(FlagSerializer(flags, many=True).data, status=status.HTTP_201_CREATED)
        else :
            response = Response(status=status.HTTP_403_FORBIDDEN)
    except Module.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)
    except Assessment.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)
    return response

@action(methods=['GET'], detail=True)
def screenshot_raw(request, pk) :
    response = None
    try:
        item = Screenshot.objects.get(pk=pk)
        if item.is_user_can_view(request.user) :
            response = Response(item.get_raw_data())        
        else :
            response = Response(status=status.HTTP_403_FORBIDDEN)
    except Screenshot.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        
    response.accepted_renderer = ImageRenderer()
    response.accepted_media_type = 'image/png'
    response.renderer_context = {}
    return response

@action(methods=['GET'], detail=True)
def attachment_raw(request, pk) :
    response = None
    try:
        item = Attachment.objects.get(pk=pk)
        if item.is_user_can_view(request.user) :
            response = Response(item.get_raw_data())
            response.content_type = "application/octet-stream"
            response['Content-Disposition'] = 'attachment; filename=' + item.attachment_name
        else :
            response = Response(status=status.HTTP_403_FORBIDDEN)
    except Attachment.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)
        
    response.accepted_renderer = BinaryRenderer()
    response.accepted_media_type = 'application/octet-stream'
    response.renderer_context = {}
    return response

@api_view(['POST'])
def cvss(request):
    serializer = CvssSerializer(data=request.data)
    if serializer.is_valid():
        cvss = Cvss(**serializer.validated_data)
        cvss.compute_cvss_value()
        response = Response(CvssSerializer(cvss).data, status=status.HTTP_201_CREATED)
    else :
        response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return response

@api_view(['POST','DELETE'])
def cvss_hit(request, pk):
    response = None
    try:
        hit = Hit.objects.get(pk=pk)
        if hit.is_user_can_edit(request.user):
            
            if request.method == 'DELETE':
                #Delete the cvss attached to the hit.
                if hit.cvss is not None :
                    Cvss.objects.get(pk=hit.cvss.id).delete()
                response = Response(status=status.HTTP_200_OK)

            else :
                serializer = CvssSerializer(data=request.data)
                if serializer.is_valid():
                    #Create the new CVSS.
                    serializer.save()
                    cvss = Cvss.objects.get(pk=serializer.data["id"])
                    cvss.compute_cvss_value()
                    cvss.save(update_fields=['decimal_value'])

                    #This condition prevent memory leak in DB.
                    if hit.cvss is not None : 
                        Cvss.objects.get(pk=hit.cvss.id).delete()

                    hit.cvss = cvss
                    hit.save(update_fields=['cvss'])
                    response = Response(status=status.HTTP_201_CREATED)
                else :
                    response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        else :
            response = Response(status=status.HTTP_403_FORBIDDEN)
    except Hit.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)
    return response

@api_view(['POST'])
def markFlagAsDone(request, pk) :
    response = None
    try:
        flag = Flag.objects.get(pk=pk)
        if flag.is_user_can_edit(request.user):
            flag.done = True
            flag.save()
            response = Response(FlagSerializer(flag).data, status=status.HTTP_200_OK)
        else :
            response = Response(status=status.HTTP_403_FORBIDDEN)
    except Flag.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)
    return response

#
# CRUD operations for a specific item.
#
def item(request, pk, class_name, serializer_name) :
    response = None
    try:
        item = class_name.objects.get(pk=pk)

        if request.method == 'GET':
            if item.is_user_can_view(request.user) :
                response = Response(serializer_name(item).data)
            else :
                response = Response(status=status.HTTP_403_FORBIDDEN)
        elif request.method == 'PUT' or request.method == 'PATCH':
            serializer = serializer_name(item, data=request.data)
            if serializer.is_valid():
                if item.is_user_can_edit(request.user) :
                    serializer.save()
                    response = Response(serializer.data)
                else :
                    response = Response(status=status.HTTP_403_FORBIDDEN)
            else :
                response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            if item.is_user_can_edit(request.user) :
                response = Response(serializer_name(item).data, status=status.HTTP_200_OK)
                item.delete()
            else :
                response = Response(status=status.HTTP_403_FORBIDDEN)

    except class_name.DoesNotExist:
        response = Response(status=status.HTTP_404_NOT_FOUND)

    return response

#
# CRUD operations for a specific list of items.
#
def items(request, class_name, serializer_name) :
    response = None
    if request.method == 'GET':
        response = Response(serializer_name(class_name.get_viewable(request.user), many=True).data)
    elif request.method == 'POST':
        serializer = serializer_name(data=request.data)
        if serializer.is_valid():
            if class_name(**serializer.validated_data).is_user_can_create(request.user) :
                serializer.save()
                response = Response(serializer.data, status=status.HTTP_201_CREATED)
            else :
                response = Response(status=status.HTTP_403_FORBIDDEN)
        else :
            response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return response

#
# Image renderer for Screenshots.
#
class ImageRenderer(BaseRenderer):
    def render(self, data, media_type='image/png', renderer_context=None):
        return data

#
# Binary renderer for Attachments.
#
class BinaryRenderer(BaseRenderer):
    def render(self, data, media_type='application/octet-stream', renderer_context=None):
        return data
