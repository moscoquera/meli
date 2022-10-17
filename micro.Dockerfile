###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM meli-base
ARG SUBFOLDER

# Create app directory
WORKDIR /project/${SUBFOLDER}
COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
#USER node

RUN mkdir -p /root/.ssh


CMD [ "npm", "run", "start:dev" ]