FROM node:14.17.4

WORKDIR /app

COPY package.json package.json

COPY src/worker/package.json src/worker/package.json
COPY src/api/package.json src/api/package.json
COPY src/dashboard/package.json src/dashboard/package.json


RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY . .