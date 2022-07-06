from django.http import JsonResponse
from rest_framework import status
import api.views

def ptart_authentication(func):
    def wrap(request, *args, **kwargs):

        token = request.headers.get("Authorization")
        if not token or token.startswith("Token ") is False :
            user = request.user
            if user.is_verified() is False :
                response = JsonResponse({}, status=status.HTTP_401_UNAUTHORIZED)
                response.accepted_renderer = api.views.JsonRenderer()
                response.accepted_media_type = 'application/json'
                response.renderer_context = {}
                return response

        return func(request, *args, **kwargs)
    
    return wrap

