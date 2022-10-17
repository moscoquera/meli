###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:latest As development

# Create app directory
WORKDIR /project
COPY .git /project/.git