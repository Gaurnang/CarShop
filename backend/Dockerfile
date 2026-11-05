FROM node:22-alpine

# Install redis server directly inside the container
RUN apk add --no-cache redis

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Start redis-server in background, then start app
CMD redis-server --daemonize yes --protected-mode no && npm start