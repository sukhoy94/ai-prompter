# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g npm@latest

COPY package.json package-lock.json* ./

RUN npm install --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "start"]
