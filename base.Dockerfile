###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:latest As development

# Create app directory
WORKDIR /project
COPY . .


WORKDIR /project/commons
RUN npm install -g typescript
RUN npm i && npm run build && npm link

WORKDIR /project