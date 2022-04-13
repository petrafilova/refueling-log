FROM node:16 AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.20.2
WORKDIR /usr/share/nginx/html/
COPY --from=builder /usr/src/app/build/ .
EXPOSE 80