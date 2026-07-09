# Supabase Auth Demo

A minimal email/password sign-up + login screen built with plain HTML, CSS, and
JavaScript, backed by [Supabase Auth](https://supabase.com/docs/guides/auth).
No frameworks, no build step — just three files.

![tabs](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-4338ca)

## What it does

- **Sign up** — creates a new user with `supabase.auth.signUp()`
- **Log in** — signs an existing user in with `supabase.auth.signInWithPassword()`
- **Session-aware UI** — `onAuthStateChange` + `getSession()` automatically show
  either the auth card or a small dashboard, and keep you logged in on refresh
- **Log out** — `supabase.auth.signOut()`

## Files

```
auth-demo/
├── index.html   # markup: tabs, login form, sign-up form, dashboard
├── style.css    # all styling — no CSS framework
└── app.js       # Supabase client + all auth logic
```

## Prerequisites

- A free [Supabase](https://supabase.com) account and project
- Any way to serve static files locally (browsers block some features, like
  redirects, when you just double-click `index.html`)
- Node.js is **not required** to run this app — Supabase is loaded from a CDN
  (`<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` in
  `index.html`). Node is only used below to get a quick local dev server.

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Wait for it to finish provisioning (~2 minutes)

### 2. Get your API credentials

In your project: **Settings → API**

- Copy the **Project URL**
- Copy the **anon / public** key (never use the `service_role` key in
  frontend code — it bypasses all security rules)

### 3. Confirm email auth is enabled

**Authentication → Providers → Email** should be toggled on. This is on by
default for new projects.

> By default Supabase requires users to confirm their email before they can
> log in. That's why sign-up shows *"Check your email to confirm"* instead of
> logging you in immediately. You can turn this off for local testing under
> **Authentication → Providers → Email → Confirm email**.

### 4. Add your credentials to the code

Open `app.js` and replace the two placeholders near the top:

```js
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
```

### 5. Run it locally

You need *some* local server — opening the HTML file directly (`file://`)
can cause Supabase's auth redirects to misbehave. The easiest options, pick one:

**Option A — no install, using `npx` (recommended for beginners):**

```bash
npx serve .
```

**Option B — install a dev server globally once, reuse it forever:**

```bash
npm install -g live-server
live-server .
```

**Option C — VS Code's "Live Server" extension** — right-click
`index.html` → *Open with Live Server*.

Then open the printed `localhost` URL in your browser.

## How auth state stays in sync

```js
supabaseClient.auth.onAuthStateChange((_event, session) => {
  if (session && session.user) {
    showLoggedInUI(session.user);
  } else {
    showLoggedOutUI();
  }
});
```

This one listener handles sign up, log in, log out, and page refresh — it's
the single source of truth for "am I logged in?" so the UI never gets out
of sync with Supabase.

## Common issues

| Symptom | Likely cause |
|---|---|
| Sign up succeeds but user never appears in **Authentication → Users** | Wrong `SUPABASE_URL` / `SUPABASE_ANON_KEY`, or a typo — double-check they're copied exactly from **Settings → API** |
| "Check your email" but login still fails | Email confirmation is required and hasn't been clicked yet — confirm the email, or disable confirmation for local testing (see step 3) |
| Nothing happens when submitting a form | Open the browser console (F12) — network/CORS errors show up there first |
| Styles don't load | Make sure `style.css` and `app.js` are in the same folder as `index.html` and you're loading via `http://localhost`, not `file://` |

## Next steps

- Add password reset (`supabase.auth.resetPasswordForEmail`)
- Add social login providers (Google, GitHub, etc.) under **Authentication → Providers**
- Store extra profile info in a `profiles` table linked to `auth.users.id`
