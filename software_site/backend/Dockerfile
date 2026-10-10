FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ajout du flag dans un dossier secret en mode exécution-only
RUN mkdir -p /secret \
  && echo '#!/bin/sh\necho "FLAG-SDIF-5d4aX4S8"' > /secret/flag.sh \
  && chmod 111 /secret/flag.sh

EXPOSE 3947
CMD ["npm", "start"]
