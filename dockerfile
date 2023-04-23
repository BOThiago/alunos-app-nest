FROM node:14-alpine

ARG APP_PORT

ENV APP_PORT ${APP_PORT}

# Crie o diretório do aplicativo
WORKDIR /app

# Instale os pacotes
COPY package*.json ./
RUN npm ci

# Copie o restante dos arquivos
COPY . .

# Copie o arquivo de entrada para o contêiner
COPY entrypoint.sh /entrypoint.sh

# Torne o arquivo de entrada executável
RUN chmod +x /entrypoint.sh

# Expose a porta para o aplicativo
EXPOSE ${APP_PORT}

# Execute o arquivo de entrada
CMD ["/entrypoint.sh"]
