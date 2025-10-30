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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Configure Supabase:

In your Supabase project dashboard:
- Go to Authentication > URL Configuration
- Add `http://localhost:3000/auth/callback` to Redirect URLs
- Enable Google OAuth provider

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  ├── auth/callback/      # OAuth callback handler
  ├── dashboard/          # Main dashboard page
  ├── login/              # Login page
  └── layout.tsx          # Root layout
components/
  └── ui/                 # shadcn/ui components
lib/
  ├── supabase/           # Supabase client utilities
  ├── types.ts            # TypeScript types
  └── mock-data.ts        # Sample event data
middleware.ts             # Auth middleware
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
4. Callback exchanges code for session
5. Middleware protects `/dashboard` routes
6. User is redirected to dashboard

## Development Notes

This project was built as part of the Fastbreak.ai technical assessment to demonstrate:
- Modern Next.js patterns (App Router, Server Components)
- Supabase integration
- Component architecture with shadcn/ui
- TypeScript best practices
- Responsive design
