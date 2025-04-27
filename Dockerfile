FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g @nestjs/cli --legacy-peer-deps

CMD ["npm", "run", "start:dev"]