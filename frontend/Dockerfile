FROM node:16.14.2-alpine3.15

LABEL maintainer='lob3767@gmail.com'

USER root
WORKDIR /frontend

COPY . /frontend

ARG https://wesalad.net

RUN npm install
RUN npm run build