FROM node:12

WORKDIR /opt/app/

COPY ./package*.json ./

RUN npm install -g pm2
RUN npm i

EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "development" ]
