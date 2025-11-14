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

## 📦 Path Aliases

The project includes path aliases for cleaner imports:

- `@/components/*` → `src/components/*`
- `@/pages/*` → `src/pages/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`
- `@/assets/*` → `src/assets/*`
- `@/styles/*` → `src/styles/*`
