FROM node:16.14.2

LABEL maintainer='lob3767@gmail.com'

WORKDIR /usr/src/app/frontend

RUN apt-get -y update
RUN apt-get -y upgrade

COPY . .

RUN npm install
RUN npm run build