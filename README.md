# DevHire — Full Stack Developer Hiring Platform

A production-ready, beautiful hiring dashboard built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 **Premium UI/UX:** Built with Tailwind CSS, shadcn/ui, and Framer Motion.
- 📝 **No-Login Application Form:** Multi-step applicant flow with Zod validation.
- 📄 **Resume Uploads:** Secure PDF storage via Supabase Storage.
- 🔐 **Admin Dashboard:** Protected routes via Next.js Middleware and Supabase Auth.
- 📊 **Analytics:** Beautiful Recharts visualizations for hiring trends.
- 🗄️ **Database:** Supabase PostgreSQL with Row Level Security.

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project.
2. Run the SQL migrations found in `supabase/migrations/`:
   - `001_create_admins.sql`
   - `002_create_applicants.sql`
   - `003_create_storage.sql`
3. Generate a bcrypt hash for your desired admin password (e.g., `custom@1234`). You can use a tool like [bcrypt-generator.com](https://bcrypt-generator.com/) (rounds: 12).
4. Edit `004_seed_admin.sql` to include your hash and run it to create the admin user.

### 2. Environment Variables

Copy the `.env.local.example` file to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

You need:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Required for admin API routes to bypass RLS)

### 3. Install & Run

```bash
npm install
npm run dev
```

The application will be running at `http://localhost:3000`.

### 4. Admin Access

Navigate to `http://localhost:3000/admin/login` and log in with the credentials you seeded.

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4 + class-variance-authority + clsx + tailwind-merge
- Components: shadcn/ui, Radix UI
- Animations: Framer Motion
- Forms: React Hook Form + Zod
- Database & Storage & Auth: Supabase
- Icons: Lucide React
- Charts: Recharts
- Notifications: Sonner
