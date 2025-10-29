# syntax=docker/dockerfile:1
#  Stage 1: Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx ng build hopebridge-frontend --configuration production


FROM httpd:2.4.65-trixie
WORKDIR /usr/local/apache2/htdocs/

COPY --from=build /app/dist/hopebridge-frontend/* .

# Copy custom Apache config for SPA routing
COPY apache-angular.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80

CMD ["httpd-foreground"]