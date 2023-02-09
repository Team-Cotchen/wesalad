FROM python:3.9
LABEL maintainer='lob3767@gmail.com'

ENV PYTHONUNBUFFERED 1

COPY . /backend
WORKDIR /backend

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

RUN apt-get update && \
    apt-get -y install libgl1-mesa-glx

EXPOSE 8000



# 이전 코드 (~23.02.09)
# RUN mkdir /backend
# WORKDIR /backend

# RUN apt-get -y update
# RUN apt-get -y upgrade

# COPY requirements.txt /backend/

# RUN pip install -r requirements.txt

# COPY . /backend/

# EXPOSE 8000

# CMD ["gunicorn", "--bind", "0.0.0.0:80", "wesalad.wsgi:application"]