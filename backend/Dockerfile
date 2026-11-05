FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install all deps including devDependencies (needed for nodemon)
RUN npm install

COPY . .

EXPOSE 5000

# Use nodemon for auto-restart on file changes
CMD ["npm", "run", "dev"]