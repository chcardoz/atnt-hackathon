FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm -i g peer
COPY . .

RUN peerjs --port 3001
EXPOSE 8080
CMD ["nodemon","server.js"]
