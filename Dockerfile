# Build stage
FROM node:18-alpine as base
WORKDIR /app
# Enable pnpm
RUN npm install -g pnpm@latest-7
# Copy pnpm requirements
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
# Copy App Requirements
COPY types/package.json types/
COPY server/package.json server/
COPY ui/package.json ui/
# Fetch packages and install all dependencies
RUN pnpm -r fetch
RUN pnpm -r install --offline
# Fetch Apps Source
COPY types types
COPY server server
COPY ui ui
# Build apps
RUN pnpm run build:docker
# Install and copy prod packages to deploy stage.
RUN pnpm -r exec rm -rf node_modules && \
        pnpm --filter @yacht/server install --prod --offline && \
        pnpm --filter @yacht/server --prod deploy pruned

# Deployment stage
FROM ghcr.io/linuxserver/baseimage-alpine:3.16 as deploy

# Set label args
ARG BUILD_DATE
ARG VERSION
ARG YACHT_VERSION
ARG REVISION

# set OCI info
LABEL org.opencontainers.image.title = "Yacht"
LABEL org.opencontainers.image.authors = "SelfhostedPro"
LABEL org.opencontainers.image.vendor = "SelfhostedPro"
LABEL org.opencontainers.image.description = "Container management platform"
LABEL org.opencontainers.image.source = "https://github.com/selfhostedpro/yacht-api"
LABEL org.opencontainers.image.documentation = "https://yacht.sh/docs/"
LABEL org.opencontainers.image.version = "${YACHT_VERSION}-alpha"
LABEL org.opencontainers.image.revision = "${REVISION}"




LABEL build_version="Yacht version:- ${VERSION} Build-date:- ${BUILD_DATE}"
LABEL maintainer="SelfhostedPro"



WORKDIR /app
COPY --from=base /app/server/package.json /app/pnpm-lock.yaml ./
COPY --from=base /app/pruned/node_modules ./node_modules
COPY --from=base /app/dist/ .
CMD node main.js
