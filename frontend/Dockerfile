# Etapa 1: compilar la SPA
FROM node:24-alpine AS build

WORKDIR /app

# Instalar dependencias desde el lockfile para obtener builds reproducibles
COPY package.json package-lock.json ./
RUN npm ci

# Compilar con vue-tsc y vite
COPY . .
RUN npm run build

# Etapa 2: servir los archivos estáticos
FROM nginx:alpine

# Copiar el resultado de la etapa de compilación
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copiar la configuración de nginx para rutas de SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
