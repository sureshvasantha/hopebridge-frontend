# syntax=docker/dockerfile:1
#  Stage 1: Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --configuration production

FROM httpd:2.4.65-trixie
WORKDIR /usr/local/apache2/htdocs/

COPY --from=build /app/dist/hopebridge-frontend/* .

EXPOSE 80

#  Stage 2: Serve with Nginx
# FROM nginx:1.29-alpine3.22

# # Copy Angular dist to Nginx html directory
# COPY --from=build /usr/src/app/dist/hopebridge-frontend/* /usr/share/nginx/html/

# # Copy custom Nginx config (optional)
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]