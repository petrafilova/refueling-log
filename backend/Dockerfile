FROM node:16 AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM node:16
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist/ .
EXPOSE 8080
CMD ["node", "server.js"]