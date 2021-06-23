FROM node:14

WORKDIR /app

COPY ./package*.json ./
COPY ./babel.config.js ./

RUN npm i

ENTRYPOINT [ "npm", "run", "build" ]
