# Fastbreak Event Dashboard

A modern sports event management dashboard built for the Fastbreak.ai technical assessment.

## Tech Stack

- **Next.js 16** - React meta-framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Supabase** - Authentication and database
- **Turbopack** - Fast bundler

## Features

- ✅ Google OAuth authentication via Supabase
- ✅ Event dashboard with real-time filtering
- ✅ Search by team, venue, or event name
- ✅ Filter by sport type and event status
- ✅ Event details modal
- ✅ Responsive design
- ✅ Protected routes with middleware

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd fast-break-ai-challenge
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Deployment (Recommended)
# Set to your deployed origin (e.g., https://your-site.netlify.app)
# For local dev you may omit or use http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Configure Supabase:

In your Supabase project dashboard:
- Go to Authentication > URL Configuration
- Add `http://localhost:3000/auth/callback` to Redirect URLs
- If deploying, also add your deployed URL: `https://your-site.example/auth/callback`
- Enable the Google OAuth provider and set client ID/secret

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  ├── auth/callback/route.ts   # OAuth callback (server route handler)
  ├── dashboard/               # Main dashboard page
  ├── login/                   # Login page
  └── layout.tsx               # Root layout
actions/
  ├── events.ts                # Server Actions for CRUD and filtered search
components/
  └── ui/                      # shadcn/ui components
lib/
  ├── supabase/                # Supabase server/browser clients
  ├── types.ts                 # TypeScript types
  └── utils.ts                 # Utilities
middleware.ts                  # Auth middleware (see deprecation note)
supabase/
  ├── migrations/              # SQL migrations
  ├── seed.sql                 # Optional seed data
  └── config.toml              # Local stack config
```

## Key Learning Points (Vue → React)

- **Server vs Client Components**: Unlike Vue, Next.js distinguishes between server and client components
- **`'use client'` directive**: Required for interactivity (useState, useEffect, event handlers)
- **Hooks**: `useState` = `ref()`, `useEffect` = `onMounted()`, `useMemo` = `computed()`
- **Props spreading**: `{...props}` = `v-bind="$attrs"`
- **Conditional rendering**: `{condition && <div>}` = `v-if`
- **List rendering**: `.map()` = `v-for`

## Authentication Flow

1. User clicks "Continue with Google" on `/login`
2. Supabase redirects to Google OAuth
3. Google redirects back to `/auth/callback`
4. Callback exchanges code for session in `app/auth/callback/route.ts` and redirects to `/dashboard`
5. Middleware protects `/dashboard` routes
6. User is redirected to dashboard

## Development Notes

This project was built as part of the Fastbreak.ai technical assessment to demonstrate:
- Modern Next.js patterns (App Router, Server Components)
- Supabase integration
- Component architecture with shadcn/ui
- TypeScript best practices
- Responsive design

### Server-backed search
- The dashboard performs debounced server-side fetching (100–500ms) via `getEventsFiltered()` to filter by title/home/away and by sport/status on the server. Venue-name matching is currently done client-side.

### Database migrations (Supabase CLI)
To push local migrations in `supabase/migrations/` to a remote project:
```bash
# Install CLI (macOS)
brew install supabase/tap/supabase

# Login and link
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>

# Push migrations
supabase db push

# Optional: seed remotely using SQL Editor with supabase/seed.sql
```

### Middleware deprecation note
- Next.js 16 warns that the `middleware` file convention is deprecated in favor of `proxy`. This project uses `middleware.ts` for auth guarding; it currently works but may require migration in a future Next.js release.
