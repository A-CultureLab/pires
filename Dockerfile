# BUILDER
FROM node:12.22.1 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:silent



# RUNNER
FROM node:12.22.1
WORKDIR /app

COPY --from=builder app/dist ./dist
COPY assets ./assets

COPY package*.json ./
COPY pm2.json .
COPY schema.prisma .
# COPY .env .

RUN npm install --production
RUN npm run generate:prisma

EXPOSE 8080

CMD ["npm", "run", "pm2"]