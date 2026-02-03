FROM python:3.13.9-alpine3.22
EXPOSE 8888

#Install dependencies
RUN apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    jpeg-dev \
    cairo-dev \
    npm

# Install mermaid-cli globally
RUN npm install -g @mermaid-js/mermaid-cli

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
ADD app /opt/ptart
WORKDIR /opt/ptart
RUN pip install -r requirements.txt

ENTRYPOINT ["gunicorn", "ptart.wsgi"]
CMD ["-b" ,"0.0.0.0:8888"]
