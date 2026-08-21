# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

DuHoc24 — a sample "study-abroad application intake portal" website used as teaching material for a 6-week course. This repo is the **Week 1** checkpoint: static UI only, backed entirely by hardcoded mock data in [lib/mock-data.ts](lib/mock-data.ts). There is no real API or database wired up yet.

Future weeks (documented in [README.md](README.md), not yet implemented) will add: a real Gemini-powered chatbot (Week 2), Supabase for persistence + a working quote form (Week 3), document upload/extraction via Gemini (Week 4), Make.com automation (Week 5), and Supabase Auth magic-link login on `/login` (Week 6). When asked to build one of these, check the README's week-by-week checklist for expected scope — don't jump ahead to later weeks' features.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```

There is no test suite configured in this repo yet.

## Architecture

- **Next.js App Router** + TypeScript + Tailwind CSS v4. Path alias `@/*` maps to repo root (see [tsconfig.json](tsconfig.json)).
- **shadcn/ui** (style `base-nova`, built on Base UI) — see [components.json](components.json) for aliases (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`). Base UI-flavored primitives live in `components/ui/`.
- The landing hero/highlights sections come from the `@tailark-oss/dusk-landing-2` block registry, converted to light theme and customized for study-abroad content — check `components/landing/` before rebuilding landing UI from scratch.
- **All data is mock data** from [lib/mock-data.ts](lib/mock-data.ts): schools (with `minGpa`/`minIelts` benchmarks), service packages, and status enums (`DocStatus`, `RequestStatus`, `ServicePackage`). Pages read directly from this file — there is no fetching layer yet. When wiring up Supabase in later weeks, this is the file whose shape the new queries should match.
- Route structure:
  - `/` — public landing page: hero, quote form, static-UI chatbot (`components/landing/chat-widget.tsx`, currently canned Q&A, no LLM call), highlights, footer.
  - `/portal` — student-facing document intake: upload UI, extracted-info display, school/benchmark matching (`components/portal/`).
  - `/admin/*` — internal dashboard sharing a layout ([app/admin/layout.tsx](app/admin/layout.tsx)) with a sidebar (`components/admin/sidebar.tsx`); `/admin` redirects to `/admin/requests`. Sub-routes: `requests`, `schools`, `profiles`, `conversations`.
  - `/login` does not exist yet — planned for Week 6 (Supabase Auth magic link), intentionally left unbuilt for students to implement themselves.
- Environment variables are not required to run `npm run dev` in this checkpoint. [.env.example](.env.example) documents variables needed for later weeks (Supabase URL/anon key, site URL for magic links) — copy to `.env.local` when that work starts.

## Quy tắc Git

- Luôn hỏi xác nhận trước khi push lên Github
- Không bao giờ commit file .env hoặc bất kỳ file chứa API key
