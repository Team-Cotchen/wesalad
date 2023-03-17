FROM node:16.14.2-alpine3.15 as builder

WORKDIR /frontend

COPY . /frontend

RUN npm install

FROM nginx:latest as final

COPY --from=builder /frontend/build /var/www/frontend
COPY --from=builder /frontend/nginx-proxy.conf /etc/nginx/conf.d/default.conf