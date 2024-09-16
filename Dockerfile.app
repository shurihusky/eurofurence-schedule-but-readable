
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine as runner
WORKDIR /app
COPY package*.json .
RUN npm install -g serve
COPY --from=builder /app/build .
CMD ["serve", "-s", "."]