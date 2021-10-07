# BUILDER
FROM node:14 AS builder

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build:silent



# RUNNER
FROM node:14
WORKDIR /app

COPY --from=builder app/dist ./dist
COPY assets ./assets

COPY package.json .
COPY yarn.lock .
COPY schema.prisma .
# COPY pm2.json .
# COPY .env .

RUN yarn --production
RUN yarn migrate:deploy
RUN yarn generate:prisma

EXPOSE 8080

CMD ["yarn", "start"]