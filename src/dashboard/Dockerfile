FROM --platform=arm64 node:16-buster-slim as build-stage

ARG API_URL
WORKDIR /app

RUN apt-get update && apt-get upgrade && apt-get --assume-yes install python3

COPY package.json package.json
COPY .npmrc .npmrc

RUN yarn install --production=true --pure-lockfile --non-interactive --cache-folder ./ycache && rm -rf ./ycache
COPY . .

RUN touch .env.production && echo "REACT_APP_API_URL=$API_URL" >> .env.production

RUN yarn build

FROM nginx:1.21.0-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#RUN ln -sf /dev/stdout /var/log/nginx/access.log \
#    && ln -sf /dev/stderr /var/log/nginx/error.log
