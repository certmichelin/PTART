FROM python:3.11
EXPOSE 8000

#Install pipenv
RUN pip install pipenv

#Install PTART.
RUN mkdir /opt/ptart
ADD . /opt/ptart
WORKDIR /opt/ptart
RUN pipenv install

#Configure PTART
RUN pipenv run python manage.py migrate
RUN pipenv run python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
RUN pipenv run python loader_common_templates.py
RUN pipenv run python loader_owasp_top10_2021_label.py
RUN pipenv run python loader_common_tools.py
RUN pipenv run python loader_owasp_testing_guide.py

CMD ["pipenv", "run","python","manage.py", "runserver", "0.0.0.0:8000"]
