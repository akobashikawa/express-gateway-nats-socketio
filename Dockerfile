# Dockerfile para el Gateway
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación y el script wait-for-it.sh
COPY . .
# COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

# Marcar el script como ejecutable (en caso de que el contenedor lo necesite)
# RUN chmod +x /usr/local/bin/wait-for-it.sh

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npx", "nodemon", "--env-file=.env", "server.js"]
# ENTRYPOINT ["sh", "-c", "wait-for-it.sh nats:4222 -- npx nodemon server.js"]