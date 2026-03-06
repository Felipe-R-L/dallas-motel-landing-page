# Dallas Motel — Landing Page

Institutional landing page and digital menu for **Dallas Motel**, located in Pitangueiras, SP. Built with React, TypeScript, Vite and Supabase.

## Features

- **Landing Page** — Hero, suites showcase, legacy/history section, amenities, and location map
- **Digital Menu** — Room service menu with categories and products, managed via an admin panel
- **Suite Management** — Dynamic suite listings with flexible pricing rules (e.g., holidays)
- **Admin Panel** — Protected area for managing products, categories, suites, and holiday pricing
- **WhatsApp FAB** — Floating action button for direct contact via WhatsApp

## Tech Stack

| Layer        | Technology            |
| ------------ | --------------------- |
| Framework    | React 18 + TypeScript |
| Build tool   | Vite                  |
| Styling      | Tailwind CSS          |
| Routing      | React Router v7       |
| Animations   | Framer Motion         |
| Icons        | Lucide React          |
| Backend / DB | Supabase (PostgreSQL) |
| Auth         | Supabase Auth         |

## Project Structure

```
src/
├── components/        # UI components (Header, Hero, Suites, Location, etc.)
│   ├── admin/         # Admin panel sub-components
│   └── menu/          # Digital menu components
├── pages/
│   ├── Home.tsx       # Main landing page
│   ├── Menu.tsx       # Digital menu page
│   └── Admin.tsx      # Admin dashboard (protected)
├── hooks/             # Custom hooks (useAuth, etc.)
├── lib/               # Supabase client setup
├── data/              # Static data
└── types/             # TypeScript types
supabase/
└── migrations/        # Database migration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd dallas-motel-landing-page
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Apply database migrations**

Run the SQL files inside `supabase/migrations/` in your Supabase project (SQL Editor), in chronological order.

5. **Start the development server**

```bash
npm run dev
```

## Available Scripts

| Command              | Description                 |
| -------------------- | --------------------------- |
| `pnpm run dev`       | Start development server    |
| `pnpm run build`     | Build for production        |
| `pnpm run preview`   | Preview production build    |
| `pnpm run lint`      | Run ESLint                  |
| `pnpm run typecheck` | Type-check without emitting |

## Admin Panel

Access the admin panel at `/admin`. Login requires valid Supabase Auth credentials. From there you can manage:

- **Products** — Room service items
- **Categories** — Product categories
- **Suites** — Suite listings and details
- **Holidays** — Special pricing rules for holidays

## License

Private project — all rights reserved.
