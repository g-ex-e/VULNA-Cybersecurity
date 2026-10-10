FROM node:18

WORKDIR /app

COPY package*.json ./

# Important : installation SANS node_modules venant de l’hôte
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
