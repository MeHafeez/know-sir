# SIR Voter Verification Help Portal

A production-ready, multilingual public awareness website for India's **Special Intensive Revision (SIR)** voter verification process.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** with custom Indian government-style palette
- **next-intl** — 13 language support (en, hi, te, ta, kn, ml, mr, gu, pa, bn, or, as, ur)
- **Framer Motion** — smooth animations
- **Lucide React** — icons
- **next-themes** — dark/light mode

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — auto-redirects to `/en`.

## Sections

| Section | File |
|---|---|
| Hero | `src/components/sections/HeroSection.tsx` |
| What is SIR | `src/components/sections/WhatIsSIR.tsx` |
| Why Important | `src/components/sections/WhyImportant.tsx` |
| Required Documents | `src/components/sections/RequiredDocuments.tsx` |
| Step-by-Step | `src/components/sections/StepByStep.tsx` |
| Official Resources | `src/components/sections/OfficialResources.tsx` |
| FAQ | `src/components/sections/FAQSection.tsx` |
| Emergency Help | `src/components/sections/EmergencyHelp.tsx` |
| State-Wise Info | `src/components/sections/StateWiseInfo.tsx` |
| Accessibility | `src/components/AccessibilityPanel.tsx` |
| AI Assistant | `src/components/AIAssistant.tsx` |

## Accessibility Features

- Font size control (Small / Normal / Large / Extra Large)
- High contrast mode
- Dyslexia-friendly font toggle
- Simple language mode
- Text-to-speech toggle
- Keyboard navigation with skip link

## Official Sources

All content sourced from:
- [eci.gov.in](https://www.eci.gov.in)
- [voters.eci.gov.in](https://voters.eci.gov.in)
- [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in)
- [nvsp.in](https://www.nvsp.in)

## Content Management

Edit `src/config/content.json` to update documents, FAQs, state contacts, helpline numbers, and steps without touching component code.

Edit `src/messages/en.json` (or any language file) to update UI text.

## Deployment

### Cloudflare Workers (recommended)

This project uses the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) for full Next.js support (API routes, middleware, SSR).

> **Important:** Deploy as a **Cloudflare Worker** (Workers Builds), **not** classic Cloudflare Pages.
> Pages only uploads static files and will fail on `.next` cache files. OpenNext deploys a Worker via a separate deploy step.

**1. Create a Worker with Git** in the [Cloudflare dashboard](https://dash.cloudflare.com/) → Workers & Pages → **Create** → **Worker** → **Import a repository**.

**2. Set build settings** (Settings → Build):

| Setting | Value |
|---|---|
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production deploy command | `npx opennextjs-cloudflare upload` *(optional)* |

Do **not** set a build output directory — the deploy command handles everything.

**3. Add runtime secrets** in Settings → **Variables & Secrets**:

| Variable | Required | Notes |
|---|---|---|
| `GROQ_API_KEY` | Yes (for AI features) | Your Groq API key — mark as **Secret** |

**4. Add build variables** (Settings → Build → Build variables):

| Variable | Value |
|---|---|
| `NODE_VERSION` | `22` |

**5. Deploy** — push to `main` and Cloudflare will build + deploy automatically.

**Local preview** (runs in the Cloudflare Workers runtime):

```bash
npm run preview
```

**Manual deploy** from your machine:

```bash
npm run deploy
```

If you already created a **Pages** project, delete it and recreate as a **Worker** with the settings above.

### Other platforms

```bash
npm run build
npm run start
```

Or deploy to Vercel — zero config required.
