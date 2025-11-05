# Mel Bijour

A modern Next.js application built with the latest technologies.

## Tech Stack

- **Next.js 16** - Latest version with App Router
- **TypeScript** - Type-safe development
- **TanStack Query** - Powerful data synchronization
- **shadcn/ui** - Beautiful and accessible components
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth** - Authentication solution
- **Axios** - HTTP client
- **Recharts** - Composable charting library

## Theme Colors

- Pink Light: `#fce7f3`
- Pink: `#f9a8d4`
- Purple: `#a855f7`
- Purple Dark: `#7c3aed`
- White: `#ffffff`
- Black: `#000000`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Set `NEXTAUTH_SECRET` to a random string
   - Configure your API URL if needed

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                   # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth routes
│   ├── globals.css        # Global styles with theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   ├── axios.ts           # Axios instance
│   ├── providers.tsx      # React Query & NextAuth providers
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
```