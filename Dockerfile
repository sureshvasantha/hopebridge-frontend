# syntax=docker/dockerfile:1
#  Stage 1: Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx ng build hopebridge-frontend --configuration production


FROM httpd:2.4.65-trixie


# Enable the rewrite module
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

# Copy custom Apache configuration
COPY apache-angular.conf /usr/local/apache2/conf/extra/apache-angular.conf

# Include the custom configuration
RUN echo "Include conf/extra/apache-angular.conf" >> /usr/local/apache2/conf/httpd.conf

WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /app/dist/hopebridge-frontend/* ./

EXPOSE 80
CMD ["httpd-foreground"]