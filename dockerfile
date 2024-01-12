FROM node:21.5.0-alpine3.18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package* ./
# runs npm install and cleans unnecessary files after, to keep image small
RUN npm install &&\
    npm cache clean --force

COPY ./app/mqttjs/index.js index.js


EXPOSE 1883
CMD ["npm", "start"]