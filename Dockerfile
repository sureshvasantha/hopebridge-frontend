# syntax=docker/dockerfile:1
#  Stage 1: Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx ng build hopebridge-frontend --configuration production


FROM httpd:2.4.65-trixie

# Backup original config to allow inclusion
RUN mkdir -p /usr/local/apache2/conf/original \
    && cp /usr/local/apache2/conf/httpd.conf /usr/local/apache2/conf/original/httpd.conf

WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /app/dist/hopebridge-frontend/ ./
COPY apache-angular.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]