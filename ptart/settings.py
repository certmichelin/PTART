import os

from dotenv import load_dotenv

BANNER = """
######  #######    #    ######  ####### 
#     #    #      # #   #     #    #    
#     #    #     #   #  #     #    #    
######     #    #     # ######     #    
#          #    ####### #   #      #    
#          #    #     # #    #     #    
#          #    #     # #     #    #    

A Pentest organizer tool for Manual Security Testers

"""

NAME = "PTART"
DESCRIPTION = "PTART is a assessment organizer tool developed for pentesters, bug bounty hunters, anybody who wants to leverage its security expertise."

VERSION = 3.1

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = str(os.getenv('SECRET_KEY'))

# Set if production (for static files)
LIVE = str(os.getenv('LIVE'))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = str(os.getenv('DEBUG'))

ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    str(os.getenv('PTART_ROOT_URL')),
]

CSRF_TRUSTED_ORIGINS = [
    str(os.getenv('PTART_ROOT_URL')),
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'ptart',
    'django_tables2',
    'django_otp',
    'django_otp.plugins.otp_totp'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

ROOT_URLCONF = 'ptart.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'ptart.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

DEFAULT_AUTO_FIELD='django.db.models.AutoField'

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Login management
#
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

# OTP management
#
OTP_TOTP_ISSUER = 'PTART'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/
STATIC_URL = 'static/'
STATIC_ROOT = str(os.getenv('STATIC_ROOT'))

REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}

X_FRAME_OPTIONS = 'SAMEORIGIN'

#API Key for ChatGPT
CHATGPT_API_KEY = str(os.getenv('CHATGPT_API_KEY'))
