# AutoApply Frontend

Frontend for an ML-powered application that automates job applications.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
autoapply-fe/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   └── sections/       # Landing page sections (Hero, Features, etc.)
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Static assets (images, icons, etc.)
│   ├── styles/             # Global styles and CSS
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Application entry point
├── public/                 # Public static files
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS** - Styling (can be extended with CSS modules, Tailwind, etc.)

## 📝 Features

- Modern React setup with TypeScript
- Component-based architecture
- Responsive design
- Path aliases for cleaner imports
- ESLint configuration
- Fast development with Vite

## 🎨 Customization

The project uses CSS custom properties (variables) defined in `src/styles/index.css`. You can easily customize colors, spacing, and other design tokens by modifying the `:root` variables.

### Brand Color System

- **Primary – Indigo 600 `#4F46E5`**: trust-building hue for navigation, hero CTAs, and focus states.
- **Secondary – Teal 500 `#14B8A6`**: growth/automation accent for highlights, chips, and illustrations.
- **Accent – Amber 500 `#F59E0B`**: limited-use urgency color for limited-time or “save hours” messaging.
- **Base Neutrals**: light surfaces (`#F9FAFB`, `#FFFFFF`) with typography in `#1F2937`/`#111827`, borders at `#E5E7EB`.

All landing-page sections consume these tokens so swapping palettes only requires updating the variables. Use the accent sparingly (critical stats, deadline chips) to preserve its urgency.

## 🔌 API Configuration

### Local Development
- **Requires local backend running on `http://127.0.0.1:8000`**
- API requests are automatically proxied through Vite dev server to your local backend
- Make sure your backend is running before starting the frontend dev server
- Can be overridden with `VITE_API_BASE_URL` environment variable if needed

### Production Deployment
- Automatically uses relative URLs when deployed on the same server as the backend
- Can be overridden with `VITE_API_BASE_URL` environment variable

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📡 Updating API Types

When backend endpoints change, regenerate TypeScript types:

```bash
npm run generate:api-types
# or
npm run update:api
```

This fetches the latest OpenAPI spec and generates types in `src/types/api-generated.ts`.

## 📦 Path Aliases

The project includes path aliases for cleaner imports:

- `@/components/*` → `src/components/*`
- `@/pages/*` → `src/pages/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`
- `@/assets/*` → `src/assets/*`
- `@/styles/*` → `src/styles/*`
