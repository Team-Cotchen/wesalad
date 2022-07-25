FROM python:3.9
LABEL maintainer='lob3767@gmail.com'

WORKDIR /usr/src/app

RUN apt-get -y update
RUN apt-get -y upgrade

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 80

CMD ["gunicorn", "--bind", "0.0.0.0:80", "wesalad.wsgi:application"]

