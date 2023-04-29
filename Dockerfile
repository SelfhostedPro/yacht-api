FROM node:lts-alpine as build-stage

# Build Frontend
WORKDIR /app/ui/
COPY ./ui/package*.json ./
RUN npm install
COPY ./ui/ .
RUN npm run build

WORKDIR /app/
COPY ./package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

# Setup Container and install Flask
FROM ghcr.io/linuxserver/baseimage-alpine:3.16 as deploy-stage
# MAINTANER Your Name "info@selfhosted.pro"
COPY root /

# Vue
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/ui/dist /app/ui
COPY nginx.conf /etc/nginx/

# Expose
VOLUME /config
EXPOSE 5000