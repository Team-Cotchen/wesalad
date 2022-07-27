FROM python:3.9
LABEL maintainer='lob3767@gmail.com'

ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
WORKDIR /backend

RUN apt-get -y update
RUN apt-get -y upgrade

COPY requirements.txt /backend/

RUN pip install -r requirements.txt

COPY . /backend/

EXPOSE 8000

# CMD ["gunicorn", "--bind", "0.0.0.0:80", "wesalad.wsgi:application"]

