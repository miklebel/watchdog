FROM --platform=arm64 node:14-buster-slim as build-stage

WORKDIR /app

RUN apt-get update && apt-get upgrade && apt-get --assume-yes install python3 build-essential

COPY package.json package.json
COPY .npmrc .npmrc
COPY nest-cli.json nest-cli.json
RUN npm i -g @nestjs/cli
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache && rm -rf ./ycache
COPY . .

CMD [ "yarn", "start" ]