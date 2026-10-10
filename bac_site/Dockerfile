FROM node:20

WORKDIR /app

# Étape 1 : config + deps
COPY package*.json ./
COPY tailwind.config.js postcss.config.js ./
RUN npm install

# Étape 2 : on copie tout le code d’un coup
COPY . .

# Étape 3 : build CSS une fois que tous les fichiers sont là
RUN npm run build:css

# Étape 4 : start
WORKDIR /app/backend
CMD ["node", "app.js"]
