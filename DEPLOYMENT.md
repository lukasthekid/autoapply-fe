# Deployment Guide

## Environment Configuration

### Local Development

When developing locally, the frontend automatically:
- Uses `https://api.project100x.run.place` as the API base URL
- Proxies API requests through Vite dev server (configured in `vite.config.ts`)

No configuration needed! Just run:
```bash
npm run dev
```

### Production Deployment

When deploying to production where both frontend and backend run on the same server:

#### Option 1: Using Relative URLs (Recommended)

The frontend automatically uses relative URLs in production mode. This works when:
- Frontend and backend are behind the same reverse proxy (nginx, etc.)
- The reverse proxy routes `/api/*` to the backend container

**No configuration needed!** The build will automatically use relative URLs.

#### Option 2: Explicit Backend URL

If you need to specify a different backend URL, create a `.env.production` file:

```bash
# .env.production
VITE_API_BASE_URL=http://localhost:8000
# or
VITE_API_BASE_URL=http://your-server-ip:8000
```

## Server Setup

### Backend Container

Your backend runs in Docker on port 8000:
```bash
docker ps
# autoapply_web container on port 8000
```

### Reverse Proxy Configuration (Nginx Example)

If using nginx as a reverse proxy, configure it like this:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (static files)
    location / {
        root /var/www/autoapply-fe/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API (proxy to Docker container)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Building for Production

```bash
# Build the frontend
npm run build

# The dist/ folder contains the production build
# Deploy this to your web server
```

## Environment Variables

### Available Variables

- `VITE_API_BASE_URL` - Override the API base URL (optional)
  - Development: Defaults to `https://api.project100x.run.place`
  - Production: Defaults to empty string (relative URLs)

### Creating Environment Files

Create `.env.production` in the project root for production overrides:

```bash
# .env.production
VITE_API_BASE_URL=http://localhost:8000
```

**Note:** `.env` files are gitignored. Create them on the server or use your deployment system's environment variable configuration.

## Testing the Configuration

### Check API Base URL

The API base URL is logged in the browser console. You can also check it in the Network tab:
- Development: Requests go to `https://api.project100x.run.place/api/*`
- Production: Requests go to `/api/*` (relative to your domain)

### Verify Backend Connection

Test the health endpoint:
```bash
# Local development
curl http://localhost:5173/api/

# Production (if using relative URLs)
curl https://your-domain.com/api/
```

## Troubleshooting

### CORS Issues

If you see CORS errors:
1. Ensure your backend allows requests from your frontend domain
2. Check that the reverse proxy is correctly configured
3. Verify the API base URL is correct

### 404 Errors on API Calls

1. Check that the backend container is running: `docker ps`
2. Verify the reverse proxy routes `/api/*` to `localhost:8000`
3. Test backend directly: `curl http://localhost:8000/api/`

### Environment Variables Not Working

1. Ensure `.env.production` is in the project root
2. Rebuild after changing environment variables: `npm run build`
3. Check that variable names start with `VITE_`

