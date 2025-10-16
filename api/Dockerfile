FROM node:22.16.0-alpine3.20

WORKDIR /app

RUN mkdir -p /app

COPY package*.json /app

RUN pnpm store prune \
  rm -rf node_modules \
  pnpm install 

COPY . /app

EXPOSE 3003

ENTRYPOINT [ "pnpm", "start:dev" ]