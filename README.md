# Content Retriever Service

A NestJS service that fetches and caches web content from URLs.

## Quick Start

### Local Development
```bash
npm install
npm run start:dev
```

### Docker
```bash
docker-compose up --build
```

## API Examples

### Submit URLs for fetching
```bash
# Local
curl -X POST http://localhost:3000/fetch \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://www.google.com"]}'

# GCP (replace GCP_IP with your VM IP)
curl -X POST http://GCP_IP/fetch \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://github.com"]}'
```

### Get cached content
```bash
# Local
curl http://localhost:3000/fetch?url=https%3A%2F%2Fwww.google.com

# GCP
curl http://GCP_IP/fetch?url=https%3A%2F%2Fgithub.com
```

## Environment
```env
PORT=3000
DATABASE_PATH=./data/db.sqlite
```

## GCP Deployment

1. **SSH to VM**
   ```bash
   ssh -i <key_path> <user>@<GCP_IP>
   ```

2. **Install Docker**
   ```bash
   sudo apt-get update
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Deploy**
   ```bash
   git clone https://github.com/LironDev/content-retriever-service.git
   cd content-retriever-service
   docker build -t content-retriever .
   docker run -d --name content-retriever -p 80:3000 -v $(pwd)/data:/app/data --restart unless-stopped content-retriever
   ```

## Features

- Async URL fetching with caching
- SQLite with TypeORM
- URL validation and sanitization
- Support for text and binary content type
- Rate limiting - 10 request per minute pre user
- Docker container
- GCP deployment ready, with docker

## Commands
```bash
npm run start:dev    # Development
npm run start:prod   # Production
npm run test         # Tests
npm run build        # Build
```
