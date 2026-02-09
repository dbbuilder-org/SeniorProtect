# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Senior Protection App ("SeniorProtect") — a mobile-first app that protects seniors (65+) from online scams, phishing, and fraud. Serves as a "trusted companion" rather than a security tool. Currently in **planning phase** (no code written yet); all files are specification documents.

## Documentation Map

There are two document sets (underscore-prefixed `01_` files are an earlier draft; dash-prefixed `01-` files are the current canonical specs):

| File | Contents |
|------|----------|
| `01-PROJECT-OVERVIEW.md` | Vision, target users, revenue model, principles |
| `02-FEATURE-SPECIFICATIONS.md` | Complete feature set: core checks, advanced protection, family dashboard, education |
| `03-UI-UX-GUIDELINES.md` | Design system, accessibility requirements, screen layouts, interaction patterns |
| `04-TECHNICAL-ARCHITECTURE.md` | Stack, system architecture, API design, DB schema, ML pipeline, security |
| `05-IMPLEMENTATION-ROADMAP.md` | 5-phase/24-month plan, team structure, budget, milestones |
| `06_SECURITY_PRIVACY.md` | Detailed security and privacy architecture |

## Planned Technology Stack

- **Mobile**: React Native (iOS + Android)
- **Web**: React
- **Backend**: Node.js (TypeScript) with Express.js or Fastify
- **Databases**: PostgreSQL (primary), Redis (cache/sessions), MongoDB (optional document store)
- **ML**: Python — Hugging Face Transformers, PyTorch/TensorFlow
- **External APIs**: Google Safe Browsing, VirusTotal, PhishTank, Twilio Lookup, Google Cloud Vision (OCR)
- **Auth**: JWT with refresh token rotation
- **Testing**: Jest (unit), Cypress/Detox (E2E)
- **Deployment**: Docker, CI/CD with blue-green deploys

## Architecture Summary

Four-layer system: Client (mobile/web/browser extension) → API Gateway (nginx/ALB with rate limiting) → Application Layer (Node.js API + Analysis Engine + Python ML Service) → Data Layer (PostgreSQL + Redis + MongoDB + S3).

All threat checks follow a parallel analysis pipeline: content is hashed, checked against cache, then simultaneously run through URL validation, sender verification, ML classification, and pattern matching. Results are aggregated into a threat level (safe/caution/danger) with the "Three Questions" framework: Who is this from? What do they want? Should I trust this?

## Key API Endpoints (planned)

- `POST /api/v1/check/{email|text|url|phone|image}` — core threat checking
- `POST /api/v1/auth/{register|login|refresh|logout}` — authentication
- `GET/PUT /api/v1/user/{profile|settings|statistics}` — user management
- `POST /api/v1/family/connect`, `GET /api/v1/family/dashboard/:seniorId` — family features
- `POST /api/v1/reports/scam` — community scam reporting
- `GET /api/v1/learn/{scam-library|daily-tip|practice-mode}` — education

## Core Design Principles (non-negotiable)

1. **Accessibility first**: 18pt+ text, 60px+ touch targets, 7:1 contrast ratio, voice alternatives for everything
2. **"Three Questions" framework** drives all check result UIs
3. **No shame, no blame**: positive reinforcement, never condescending
4. **One thing at a time**: never overwhelm the user
5. **Privacy-respecting**: minimal data collection, content hashes over full text, 90-day auto-deletion for checks, family features are opt-in only

## Database Schema (key tables)

`users`, `scam_reports`, `known_scams`, `family_connections`, `threat_checks` — see `04-TECHNICAL-ARCHITECTURE.md` for full schema with column definitions.

## Implementation Phases

1. **Foundation & MVP** (Months 1-4): Email/text checker, URL validator, trusted sites, basic ML, accessibility
2. **Enhanced Protection** (Months 5-8): OCR/image scanning, phone checker, family dashboard, browser extension
3. **Advanced Features** (Months 9-12): Context-aware protection, payment protection, "I Made a Mistake" recovery, practice mode
4. **Scale & Expand** (Months 13-18): Email/SMS integrations, ML v2, B2B partnerships
5. **Maturity** (Months 19-24): Internationalization, desktop app, smart device integration, AI assistant

## When Building This App

- Custom UI component library required (no generic UI libs) — all components must meet senior accessibility standards
- Rate limits: 100 checks/hour, 500/day per user; 10 checks/hour unauthenticated
- All check results must include the "Three Questions" response structure (`whoIsThisFrom`, `whatDoTheyWant`, `shouldITrust`)
- Threat levels are always one of: `safe`, `caution`, `danger`
- Content should be hashed (SHA-256) and cached in Redis (TTL: 1 hour) before running analysis
- ML models served via separate Python API containers; inference must be < 500ms
- Never store full email/message content unencrypted; prefer content hashes
