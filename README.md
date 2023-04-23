<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Alunos App Nest

O Alunos App Nest é um aplicativo de gerenciamento de alunos desenvolvido com NestJS, um framework Node.js progressivo para construção de aplicações eficientes, escaláveis e fáceis de manter no lado do servidor.

## Funcionalidades

- Gerenciamento de Títulos
- Gerenciamento de Usuários
- Autenticação JWT
- Gerenciamento de Email
- Integração com API REST
- Testes Automatizados

## Pré-requisitos

- Node.js v14.x.x ou superior
- NPM ou Yarn
- Git

## Instalação utilizando Docker

1. No terminal, navegue até a raiz do projeto e execute o comando abaixo para construir a imagem do Docker:

_execute no terminal_

> docker-compose up -d

Este comando cria uma imagem Docker chamada alunos-app-nest com base no conteúdo do arquivo Dockerfile.

2. Após a construção da imagem, execute o seguinte comando para iniciar um container com base na imagem criada:

_execute no terminal_

> docker run -p porta:porta --name alunos-app-container alunos-app-nest-app

Este comando inicia um container chamado alunos-app-container, mapeando o container para a porta desejada do seu computador.

3. Agora a API estará disponível em http://localhost:porta. Para parar o container, use o seguinte comando:

_execute no terminal_

> docker stop alunos-app-container

Para remover o container após pará-lo, execute:

docker rm alunos-app-container

#### Lembre-se de que, caso faça alguma alteração no código-fonte, será necessário reconstruir a imagem Docker e reiniciar o container para que as mudanças entrem em vigor.

## Instalação e Execução

1. Clone o repositório:

git clone https://github.com/BOThiago/alunos-app-nest.git
cd alunos-app-nest

Instale as dependências do projeto:

_Utilizando NPM_

> npm install

> _Utilizando Yarn_
> yarn install

## Preencha a .env com as variáveis de ambiente

### Crie uma migração:

_Utilizando NPM_

> npx prisma migrate dev

> _Utilizando Yarn_
> yarn prisma migrate dev

### Gere a migração:

_Utilizando NPM_

> npx prisma generate

> _Utilizando Yarn_
> yarn prisma generate

### Inicie o aplicativo em modo de desenvolvimento:

_Utilizando NPM_

> npm run start:dev

> _Utilizando Yarn_
> yarn start:dev

> O aplicativo estará disponível no endereço http://localhost:porta no navegador.

Testes (É necessário criar as variáveis de ambiente em "./src/test/variaveis")

### Para executar os testes, utilize o seguinte comando:

_Utilizando NPM_
npm test

_Utilizando Yarn_
yarn test

## Documentação da API (Swagger)

A documentação da API REST pode ser acessada através da URL http://localhost:porta/api após iniciar o aplicativo em modo de desenvolvimento.
