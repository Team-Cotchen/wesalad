FROM python:3.9-slim as build

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

COPY requirements.txt /backend

RUN set -ex \
    apt-get update && \
    apt-get upgrade -y && \
    pip install -r requirements.txt && \
    apt-get autoremove -y && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*

COPY . /backend

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wesalad.wsgi:application"]