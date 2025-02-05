# Usa una imagen oficial de Playwright
FROM mcr.microsoft.com/playwright:v1.50.0

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo .env a la imagen
COPY .env .env

# Copia los archivos de la aplicación
COPY package.json package-lock.json ./ 
COPY . ./ 

# Instala dependencias
RUN npm install

# Ejecuta Playwright
CMD ["npx", "playwright", "test"]
