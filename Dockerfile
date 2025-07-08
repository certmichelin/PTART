FROM python:3.12.4-alpine3.20
EXPOSE 8000

#Install dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    jpeg-dev \
    cairo-dev

# Install pandoc 3.2.1 manually based on architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget https://github.com/jgm/pandoc/releases/download/3.2.1/pandoc-3.2.1-linux-amd64.tar.gz && \
        tar -xvzf pandoc-3.2.1-linux-amd64.tar.gz --strip-components 1 -C /usr/local && \
        rm pandoc-3.2.1-linux-amd64.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget https://github.com/jgm/pandoc/releases/download/3.2.1/pandoc-3.2.1-linux-arm64.tar.gz && \
        tar -xvzf pandoc-3.2.1-linux-arm64.tar.gz --strip-components 1 -C /usr/local && \
        rm pandoc-3.2.1-linux-arm64.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi

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
