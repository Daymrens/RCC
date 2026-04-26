# RoboDesk Deployment Guide

This guide covers deploying RoboDesk for production use.

## Important Note

RoboDesk is designed as a **localhost-first application** for direct hardware access. WebSerial and WebBluetooth APIs require:
- HTTPS (or localhost)
- User permission prompts
- Chrome/Edge browser

## Deployment Options

### Option 1: Local Desktop App (Recommended)

Package as an Electron app for native desktop experience:

```bash
# Install Electron
pnpm add -D electron electron-builder

# Build both apps
pnpm build

# Package as desktop app
# (Electron configuration needed)
```

Benefits:
- No HTTPS required
- Direct hardware access
- Offline capable
- Native feel

### Option 2: Local Network Server

Run on a local machine accessible via LAN:

```bash
# Build production
pnpm build

# Set environment variables
export NODE_ENV=production
export PORT=3001

# Start server
node apps/server/dist/index.js

# Start frontend (or use static export)
cd apps/web && pnpm start
```

Access via: `https://192.168.x.x:3000` (HTTPS required for WebSerial/BLE)

### Option 3: Cloud Deployment (Limited)

Deploy to cloud with limitations:

**Backend:**
- Deploy to any Node.js host (Heroku, Railway, Render)
- Use PostgreSQL instead of SQLite for production
- Serial/BLE will only work server-side (no browser APIs)

**Frontend:**
- Deploy to Vercel, Netlify, or any static host
- WebSerial/BLE will work if accessed via HTTPS

**Limitations:**
- Server-side serial requires physical device connection to server
- BLE range limited to server location
- Not ideal for remote device control

## Production Configuration

### Environment Variables

Create `.env.production`:

```bash
# Database (use PostgreSQL for cloud)
DATABASE_URL="postgresql://user:pass@host:5432/robodesk"

# Server
PORT=3001
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Database Migration

For PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migration:
```bash
pnpm db:migrate
```

### Security Considerations

1. **CORS**: Update CORS origins in `apps/server/src/index.ts`
2. **Authentication**: Add auth middleware (not included)
3. **Rate Limiting**: Add rate limiting for API endpoints
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Always use HTTPS in production

### Build Commands

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Generate Prisma client
pnpm db:generate

# Build both apps
pnpm build

# Start production server
NODE_ENV=production node apps/server/dist/index.js &
cd apps/web && pnpm start
```

## Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Build
RUN pnpm build

EXPOSE 3000 3001

CMD ["pnpm", "start"]
```

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Logging (Winston, Pino)
- Health check endpoints

## Backup

Backup SQLite database regularly:

```bash
# Backup
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# Restore
cp prisma/backup-20240101.db prisma/dev.db
```

For PostgreSQL, use `pg_dump`.

## Scaling Considerations

RoboDesk is designed for single-user/small team use. For scaling:
- Add Redis for Socket.io adapter (multi-instance)
- Use PostgreSQL with connection pooling
- Add load balancer for multiple backend instances
- Consider WebSocket sticky sessions

## Troubleshooting

**WebSerial not working:**
- Ensure HTTPS (or localhost)
- Check browser compatibility
- Verify user granted permissions

**BLE not connecting:**
- Check BLE adapter on server
- Verify noble installation
- Check device is in range

**Database errors:**
- Run migrations: `pnpm db:migrate`
- Regenerate client: `pnpm db:generate`
- Check DATABASE_URL

## Recommended Setup

For most users:
1. Run locally on development machine
2. Access via `localhost:3000`
3. Connect devices via USB/Bluetooth
4. Use WebSerial/WebBluetooth for direct access

This provides the best experience with full hardware access and no deployment complexity.
