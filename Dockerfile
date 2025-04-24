FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

RUN npm install -g nodemon

CMD ["npm", "run", "start:dev"]