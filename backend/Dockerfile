# Dockerfile pour le backend
FROM node:14

WORKDIR /app

# Installation du client PostgreSQL
RUN apt-get update && apt-get install -y postgresql-client

COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . ./
EXPOSE 5000
CMD ["node", "server.js"]
