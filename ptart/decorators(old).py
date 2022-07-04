""" from rest_framework import authentication, permissions
from rest_framework.decorators import api_view
from django_otp.decorators import otp_required
from django.conf import settings
from django.contrib.auth.decorators import login_required

def ptart_authentication(func):
    def wrap(request):
        #Traitement
        # if auth token given :
        #   @authentication_classes([TokenAuthentication])
        #   @permission_classes([IsAuthenticated])
        # else :
        #   @otp_required
        #print(request.authentication_classes)
        
        if request.headers.get("Authorization"): #if a token is given
            authentication_classes = [authentication.TokenAuthentication]
            permission_classes = [permissions.IsAuthenticated]
        else:
            authentication_classes = [authentication.SessionAuthentication]
            permission_classes = [permissions.IsAuthenticated]
                #otp_required()
                
        return func(request)
        

    wrap.__doc__ = func.__doc__
    wrap.__name__ = func.__name__
    return wrap """