# Usa Node 22.14.0 (usa 22.1.0 si aún no está 22.14.0 en Docker Hub)
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.docker .env

EXPOSE 3001

CMD ["npm", "run", "start"]
