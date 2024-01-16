FROM node:21.5.0-alpine3.18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY ./backend/package* ./
# runs npm install and cleans unnecessary files after, to keep image small
RUN npm install &&\
    npm cache clean --force

COPY ./backend/app.js app.js


EXPOSE 1883
CMD ["node", "app.js"]