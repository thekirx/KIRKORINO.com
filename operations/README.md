# Operations

The team's internal workspace at **operations.kirkorino.com**. Phase 1 covers:

- **Google sign-in** (invite only, personal Gmail is fine) and a **role picker** on first sign-in. General Manager and Finance stay locked until Kirk confirms.
- **Home**: daily greeting pop-up, Needs your OK (Kirk), your next steps as cards, Today, Add a task, Who’s in, What just happened.
- **Outreach**: the 7-stage flow (Prospect → Researched → Contacted → Interested → Meeting → Proposal → Won), off-list reasons, prospects, research facts, email drafts from templates, call/email logging, a Gmail thread link, and Won → project automatically.
- **Team & roles** (Kirk only): add people by Google email, roles and access per area, new roles (e.g. interns), leave dates, moving urgent work, and the daily greeting with seasonal presets.

Finance, Projects and Social & ops pages come in Phase 2. Finance is already locked to General Manager and Finance in the database.

Stack: Next.js 16 (App Router) · Supabase (Postgres, Auth, row-level security) · Vercel.

---

## Setup (about 20 minutes, once)

### 1. Supabase project

1. Create a new project at [supabase.com](https://supabase.com) (region: Singapore is closest to Manila).
2. **SQL Editor** → paste all of `supabase/migrations/0001_phase1.sql` → **Run**.
3. Copy `supabase/seed.example.sql` to `supabase/seed.sql` (it is git-ignored), put in the four real Google emails, paste it into the SQL Editor → **Run**. Never commit real emails: this repository is public.
4. **Authentication → Hooks** → add **Before User Created** → type **Postgres** → schema `public` → function `hook_before_user_created`. This is what blocks Google accounts that aren’t on the team.
5. **Authentication → URL Configuration**: Site URL `https://operations.kirkorino.com`; add redirect URLs `https://operations.kirkorino.com/auth/callback` and `http://localhost:3000/auth/callback`.

### 2. Google sign-in

1. [Google Cloud Console](https://console.cloud.google.com) → create a project → **APIs & Services → OAuth consent screen**: External, app name “Operations”.
2. **Credentials → Create credentials → OAuth client ID** → Web application. Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback` (Supabase shows the exact one under Authentication → Providers → Google).
3. Supabase → **Authentication → Providers → Google**: turn on, paste the Client ID and Client secret.

### 3. Vercel

1. In your Vercel project: **Settings → Git** → connect `thekirx/KIRKORINO.com`. **Settings → Build and Deployment → Root Directory** → `operations`. (The portfolio keeps its own Vercel project with the repo root, so the two deploy separately.)
2. **Settings → Environment Variables** (Production and Preview):
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase → Project Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the publishable (anon) key
3. **Settings → Domains** → add `operations.kirkorino.com`, then add the DNS record Vercel shows.

### 4. First sign-in

Kirk signs in first (already admin). Everyone else signs in and picks a role; Kirk confirms General Manager or Finance from **Needs your OK** on Home.

---

## Local development

```bash
cd operations
cp .env.example .env.local   # fill in the two values
npm install
npm run dev                  # http://localhost:3000
```

## How access works

- `members` holds who may sign in (Google email), their role and status (`invited`, `pending_confirm`, `active`, `on_leave`, `removed`).
- `role_permissions` sets each role’s level per area: `hidden`, `view`, `edit`, `approve`. Only admins can change roles or permissions.
- Every table has row-level security that calls `can(area, level)` / `is_admin()`, so the rules hold even outside the app. Kirk (`is_owner`) can’t be demoted or removed.
- History is written by database triggers (stage moves, owner changes, logged calls and emails) into `activity`.
