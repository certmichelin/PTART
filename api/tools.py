from drf_extra_fields.fields import Base64FileField

class FileField(Base64FileField):
    ALLOWED_TYPES = ['ptart']

    def get_file_extension(self, filename, decoded_file):
        return "ptart"