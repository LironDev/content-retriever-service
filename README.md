# Content Retriever Service

A NestJS service that fetches and caches web content from URLs.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

## API

### Submit URLs for fetching
```bash
curl --location 'http://localhost:3000/fetch' \
--header 'Content-Type: application/json' \
--data '{"urls": ["https://www.google.com"]}'
```

### Get cached content
```bash
curl --location 'http://localhost:3000/fetch?url=https%3A%2F%2Fwww.google.com'
```

## Environment

Create `.env` file:
```env
PORT=3000
DATABASE_PATH=./data/db.sqlite
```

## Commands

```bash
npm run start:dev    # Development
npm run start:prod   # Production
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

## Features

- Asynchronous URL fetching
- Content caching with TTL
- SQLite storage
- URL validation
- Multiple content types support
