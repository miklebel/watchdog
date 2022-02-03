FROM node:14.17.4

WORKDIR /app

COPY package.json package.json
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache
COPY . .

CMD [ "yarn", "start" ]