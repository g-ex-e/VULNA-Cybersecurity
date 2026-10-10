# backend/Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🛠️ 1. Générer Prisma Client
RUN npx prisma generate

# 🛠️ 2. Chiffrer le fichier contract.txt en contract.enc
RUN npx ts-node scripts/encryptContract.ts

# 🛠️ 3. Migrer la base de données
RUN npx prisma migrate dev --name init --skip-seed

EXPOSE 7989

# 🚀 4. Démarrer le serveur
CMD ["npx", "ts-node-dev", "src/index.ts"]
