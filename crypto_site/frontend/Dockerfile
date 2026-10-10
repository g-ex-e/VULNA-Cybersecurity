FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# On utilise une image plus légère pour juste servir le site
FROM node:18-slim

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 7988

CMD ["serve", "-s", "dist", "-l", "7988"]
