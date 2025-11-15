# API Type Generation Scripts

This directory contains scripts for automatically generating TypeScript types from the backend OpenAPI specification.

## Usage

When you add new endpoints to the backend, run:

```bash
npm run generate:api-types
```

Or use the shorter alias:

```bash
npm run update:api
```

Or:

```bash
npm run api:types
```

## What it does

1. **Fetches** the latest OpenAPI specification from your backend API
2. **Generates** TypeScript types automatically
3. **Saves** them to `src/types/api-generated.ts`

## Configuration

The script uses the API URL from:
- Environment variable: `VITE_API_BASE_URL` (if set)
- Default: `https://api.project100x.run.place`

You can override it by setting the environment variable:

```bash
VITE_API_BASE_URL=https://your-api-url.com npm run generate:api-types
```

## Generated Types

The generated types follow the OpenAPI specification structure:

```typescript
import type { paths, components } from '@/types/api-generated'

// Use path types
type RegisterResponse = paths['/api/auth/register']['post']['responses']['201']['content']['application/json']

// Use component types
type User = components['schemas']['UserSchema']
type TokenResponse = components['schemas']['TokenResponseSchema']
```

## Notes

- The generated file (`api-generated.ts`) should **NOT** be edited manually
- It will be overwritten each time you run the script
- For custom types, use `src/types/api.ts` instead
- The script automatically adds a header with generation timestamp and source URL

