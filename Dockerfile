FROM node:18-alpine

WORKDIR /app

# Install build dependencies and curl for health checks
RUN apk add --no-cache python3 make g++ sqlite-dev curl

COPY package*.json ./
RUN npm install && npm rebuild sqlite3 --update-binary

COPY . .
RUN npm run build

RUN mkdir -p /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default to production; can be overridden by docker-compose
CMD ["npm", "run", "start:prod"]