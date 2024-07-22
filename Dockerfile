FROM python:3.12
EXPOSE 8000

#Install PTART.
RUN mkdir /opt/ptart
ADD . /opt/ptart
WORKDIR /opt/ptart
RUN pip install -r requirements.txt
RUN cp .env.template .env

#Configure PTART
RUN python manage.py migrate
RUN python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
RUN python loader_common_templates.py
RUN python loader_owasp_top10_2021_label.py
RUN python loader_common_tools.py
RUN python loader_owasp_testing_guide.py

CMD ["python","manage.py", "runserver", "0.0.0.0:8000"]
