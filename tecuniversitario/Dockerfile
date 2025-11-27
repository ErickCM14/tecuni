# Etapa 1: Build
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.docker .env

RUN npm run build

# Etapa 2: Servir con 'serve'
FROM node:22-slim

WORKDIR /app

# Copiar solo la carpeta 'dist'
COPY --from=builder /app/dist ./dist

# Instalar 'serve' para servir la app como sitio estático
RUN npm install -g serve

EXPOSE 4321

# Usamos 'serve' para servir el contenido en /landing-pages/
CMD ["serve", "dist", "-p", "4321"]
