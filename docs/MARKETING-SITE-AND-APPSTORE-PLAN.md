# Marketing Site & App Store Submission Plan

**Date:** 2026-02-10
**Domain:** seniorprotect.ai (Cloudflare — purchased)
**Version:** 2.0.0
**Status:** Ready to execute

---

## Part 1: Marketing Website (Next.js + Vercel)

### Project Setup

```
~/dev2/seniorprotect-site/   (separate repo, NOT in the monorepo)
├── app/
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Landing page
│   ├── privacy/page.tsx     # Privacy policy (required for both stores)
│   ├── terms/page.tsx       # Terms of service
│   ├── support/page.tsx     # Support/contact (required for both stores)
│   └── press/page.tsx       # Press kit / about (optional v1)
├── components/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── EmailForward.tsx
│   ├── Testimonials.tsx
│   ├── AppStoreButton.tsx
│   ├── Footer.tsx
│   └── Header.tsx
├── public/
│   ├── og-image.png         # 1200x630 social share image
│   ├── icon-192.png
│   ├── icon-512.png
│   └── screenshots/         # App screenshots for the site
├── tailwind.config.ts
└── next.config.ts
```

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Deploy:** Vercel (free tier)
- **Domain:** seniorprotect.ai → Vercel (Cloudflare DNS, proxy OFF for Vercel)
- **Analytics:** Vercel Analytics (free tier)

### Landing Page Sections (top to bottom)

#### 1. Hero
- Headline: "Your Trusted Companion Against Online Scams"
- Subhead: "SeniorProtect helps you check suspicious emails, texts, and websites — in seconds."
- CTA: App Store badge + "Or just forward emails to check@seniorprotect.ai"
- Hero image: phone mockup showing the app's home screen with colored favorite cards
- Background: warm, soft gradient (not dark/techy — approachable)

#### 2. How It Works (3 steps)
1. "Forward any suspicious email to check@seniorprotect.ai"
2. "We analyze the sender, links, and language"
3. "Get a clear answer: Safe, Be Careful, or Danger"
- Simple icons or illustrations for each step
- Emphasize: no app needed for email checking

#### 3. Features Grid
- Check Emails & Texts — paste or forward, get instant analysis
- Trusted Sites — curated database of verified safe websites
- Email Forwarding — just forward to check@seniorprotect.ai, no app needed
- Family Dashboard — (coming soon badge) stay connected with family
- No Shame, No Blame — positive, encouraging experience
- Privacy First — we never store your emails, only analyze and delete

#### 4. The Three Questions
- Visual explainer of the framework:
  - "Who is this from?"
  - "What do they want?"
  - "Should I trust this?"
- Show a sample result card (safe example and danger example)

#### 5. Email Forwarding CTA (standalone section)
- Large, prominent: "Don't want to install an app? Just forward it."
- `check@seniorprotect.ai` in large, copyable text
- "Works from any email app on any device"

#### 6. Social Proof / Stats
- "$12.5 billion lost to senior scams last year"
- "50+ verified trusted sites"
- Placeholder for testimonials / beta tester quotes

#### 7. Download / CTA
- App Store badge (TestFlight link initially, App Store link when live)
- Google Play "Coming Soon" badge
- QR code for easy phone scanning

#### 8. Footer
- Links: Privacy Policy, Terms of Service, Support, Contact
- "Made by ServiceVision" + copyright 2026
- Social links (if applicable)

### SEO & Meta

```tsx
// app/layout.tsx metadata
export const metadata = {
  title: 'SeniorProtect — Your Trusted Companion Against Online Scams',
  description: 'Free app that helps seniors check suspicious emails, texts, and websites. Forward any email to check@seniorprotect.ai for instant scam analysis.',
  keywords: ['senior scam protection', 'email scam checker', 'phishing protection for seniors', 'elder fraud prevention'],
  openGraph: {
    title: 'SeniorProtect — Check Any Suspicious Email in Seconds',
    description: 'Forward suspicious emails to check@seniorprotect.ai. Free, private, no app required.',
    url: 'https://seniorprotect.ai',
    image: '/og-image.png',
  },
};
```

### Required Pages for App Store + Google Play

Both stores require these URLs:

| Page | URL | Content |
|------|-----|---------|
| **Privacy Policy** | `seniorprotect.ai/privacy` | Data collection, retention (90-day auto-delete), no raw content storage, hashing policy, Clerk auth data, analytics |
| **Terms of Service** | `seniorprotect.ai/terms` | Usage terms, rate limits, disclaimer (not legal/financial advice), acceptable use |
| **Support** | `seniorprotect.ai/support` | Contact email (support@seniorprotect.ai), FAQ, how to use the app |

### DNS Setup (Cloudflare)

| Record | Type | Name | Value | Proxy |
|--------|------|------|-------|-------|
| Vercel | CNAME | `@` | `cname.vercel-dns.com` | OFF (grey cloud) |
| Vercel | CNAME | `www` | `cname.vercel-dns.com` | OFF |
| Email routing | MX | `@` | (Cloudflare auto-configures) | N/A |
| Email worker | TXT | `@` | SPF record for replies | N/A |
| Resend sending | TXT/CNAME | (per Resend docs) | DKIM/SPF for seniorprotect.ai | N/A |

**Important:** Vercel requires Cloudflare proxy OFF (grey cloud) for their SSL to work.

---

## Part 2: App Icon (DONE)

**File:** `app/assets/icon.png` (1024x1024)
**Design:** Navy blue shield with red stripes, white "SP" text, decorative stars, green checkmark
**Theme:** Red, white, and blue — patriotic, trustworthy, authoritative
**Source SVG:** `app/assets/icon-source.svg` (editable)

Expo/EAS auto-generates all required sizes from the 1024x1024 source.
Splash screen background updated to match: `#0D2240` (dark navy).

---

## Part 3: iOS — TestFlight & App Store

### Prerequisites
- [x] Apple Developer account (Team ID: J745X8LR59)
- [x] Bundle ID: `net.servicevision.seniorprotect`
- [x] EAS CLI installed (`npm install -g eas-cli`)
- [x] App icon 1024x1024
- [ ] App Store Connect app created
- [ ] Privacy policy URL live
- [ ] Support URL live

### Step 1: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. My Apps → "+" → New App
3. Fill in:
   - **Platform:** iOS
   - **Name:** SeniorProtect
   - **Primary language:** English (U.S.)
   - **Bundle ID:** net.servicevision.seniorprotect
   - **SKU:** seniorprotect-ios
   - **Access:** Full Access

### Step 2: Build for TestFlight

```bash
# From the app/ directory

# First time: link EAS to the project
eas build:configure

# Build for iOS (sends to App Store Connect automatically)
eas build --platform ios --profile production

# This will:
# - Build in the cloud on EAS servers
# - Sign with your Apple credentials
# - Upload the .ipa to App Store Connect
# - Takes ~15-20 minutes
```

### Step 3: Configure TestFlight

1. In App Store Connect → TestFlight tab
2. The build appears automatically after EAS upload
3. Fill in:
   - **Test Information:**
     - Beta App Description: "SeniorProtect helps seniors check suspicious emails and texts for scams."
     - Feedback Email: chris@servicevision.net
     - Privacy Policy URL: https://seniorprotect.ai/privacy
   - **Export Compliance:** Select "No" for encryption beyond standard HTTPS
4. **Internal Testing:**
   - Create group "Internal Testers"
   - Add testers by Apple ID email
   - Build auto-distributes to internal testers (no review needed)
5. **External Testing (optional, requires Beta App Review):**
   - Create group "Beta Testers"
   - Add up to 10,000 testers by email
   - Submit for Beta App Review (~24-48 hours)
   - Share public TestFlight link

### Step 4: TestFlight Distribution

```
# Get the TestFlight public link from App Store Connect
# Share format: https://testflight.apple.com/join/XXXXXXXX
# Put this link on the marketing website
```

### Step 5: App Store Submission (while testing)

In App Store Connect → App Store tab → Version 2.0.0:

#### App Information
| Field | Value |
|-------|-------|
| Name | SeniorProtect |
| Subtitle | Scam Check for Emails & Texts |
| Category | Utilities |
| Secondary Category | Lifestyle |
| Content Rights | Does not contain third-party content |
| Age Rating | 4+ |

#### Pricing
- **Price:** Free
- **Availability:** United States (expand later)

#### App Privacy (Data Collection)
Apple requires you to declare what data the app collects:

| Data Type | Collected? | Linked to Identity? | Tracking? |
|-----------|-----------|---------------------|-----------|
| Email Address | Yes (Clerk auth) | Yes | No |
| Name | Yes (Clerk auth) | Yes | No |
| User Content | Yes (check submissions) | No (hashed) | No |
| Diagnostics | No | No | No |

Select: "Data Used to Track You" → No
Select: "Data Linked to You" → Contact Info (email, name)
Select: "Data Not Linked to You" → Content (hashed check submissions)

#### Version Information
| Field | Value |
|-------|-------|
| Version | 2.0.0 |
| What's New | See release notes below |
| Promotional Text | Forward any suspicious email to check@seniorprotect.ai — no app needed. Free scam checking for emails, texts, and websites. |
| Description | (full description — see below) |
| Keywords | scam,phishing,senior,elder,fraud,email check,text check,safe sites,protection,security |
| Support URL | https://seniorprotect.ai/support |
| Privacy Policy URL | https://seniorprotect.ai/privacy |
| Marketing URL | https://seniorprotect.ai |

#### Screenshots (required)

**iPhone 6.7" display (required — iPhone 15 Pro Max): 1290 x 2796 px**
**iPhone 6.5" display (required — iPhone 14 Plus): 1284 x 2778 px**
**iPad 12.9" (optional): 2048 x 2732 px**

| # | Screen | Caption |
|---|--------|---------|
| 1 | Home screen with favorites | "Your trusted sites, one tap away" |
| 2 | Sites tab with favicons & stars | "50+ verified safe websites" |
| 3 | Check Email screen | "Paste any suspicious email" |
| 4 | Check result — Danger | "Clear answers: Safe, Caution, or Danger" |
| 5 | Check result — Safe | "Know who it's from and what they want" |
| 6 | Email forwarding promo | "Just forward to check@seniorprotect.ai" |

**How to capture screenshots:**
```bash
# Run the app in iOS Simulator with the right device
# iPhone 15 Pro Max for 6.7" screenshots
xcrun simctl boot "iPhone 15 Pro Max"
cd app && npx expo start --ios

# In Simulator: Cmd+S to save screenshot
# Screenshots save to ~/Desktop by default
```

**Screenshot framing options:**
- https://screenshots.pro — automated framing with captions
- https://appmockup.io — free device mockup generator
- Figma — manual but full control

#### Review Information
| Field | Value |
|-------|-------|
| Contact First Name | Chris |
| Contact Last Name | Therriault |
| Contact Phone | (your phone number) |
| Contact Email | chris@servicevision.net |
| Demo Account | Not required (sites/check work without login) |
| Notes for Reviewer | "Core features (site browsing, email/text checking) work without authentication. Sign-in is only required for saving check history." |

#### Submit
1. Select the TestFlight build
2. Click "Add for Review"
3. Click "Submit to App Review"
4. Review typically takes 24-48 hours (first submission may take longer)

### App Store Description (full text)

```
SeniorProtect is your trusted companion against online scams. Check any suspicious email, text message, or website in seconds — and get a clear, simple answer.

HOW IT WORKS

Paste a suspicious email or text into the app, and SeniorProtect instantly analyzes it for scam signals. Every check answers three simple questions:

• Who is this from?
• What do they want?
• Should I trust this?

You'll get a clear result: Safe (green), Be Careful (yellow), or Danger (red) — with plain-language explanations, never confusing technical jargon.

DON'T WANT TO USE THE APP?

Just forward any suspicious email to check@seniorprotect.ai and we'll reply with the results. Works from any email app on any device — no installation needed.

TRUSTED SITES

Browse our curated database of 50+ verified safe websites — banking, healthcare, government, shopping, and more. Star your favorites for quick access from the home screen.

BUILT FOR SENIORS, BY PEOPLE WHO CARE

• Large text and touch targets throughout
• Simple, one-thing-at-a-time design
• No shame, no blame — we're here to help
• Your privacy matters — we never store your emails

FREE TO USE

Core scam checking is completely free. No subscription required for email and text checks.

SeniorProtect — because everyone deserves to feel safe online.
```

### What's New (v2.0.0)

```
Version 2.0 — a major update:

• Favorite trusted sites with one-tap star toggle
• Visual site recognition with website icons
• Category-colored cards for quick browsing
• 56 verified trusted sites across 8 categories
• New: Transportation sites (AAA, Uber, Lyft, Amtrak)
• New: Pharmacy sites (CVS, Walgreens, Rite Aid)
• Screenshot support for email and text checking
• Improved accessibility and larger touch targets
```

---

## Part 4: Android — Google Play

### Prerequisites
- [ ] Google Play Developer account ($25 one-time fee): https://play.google.com/console
- [ ] Bundle ID: `net.servicevision.seniorprotect` (already in app.json)
- [ ] Google Play service account key (for EAS Submit)
- [ ] Privacy policy URL live
- [ ] At minimum 2 screenshots, feature graphic

### Step 1: Create Google Play Developer Account

1. Go to https://play.google.com/console
2. Sign in with a Google account (use a business/team account, not personal)
3. Pay $25 one-time registration fee
4. Complete identity verification (takes 1-3 business days)
5. Verify developer email and phone

### Step 2: Create App in Google Play Console

1. All apps → Create app
2. Fill in:
   - **App name:** SeniorProtect
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations (policies, US export laws, etc.)

### Step 3: Set Up Google Play Service Account (for EAS)

This allows `eas submit` to upload builds automatically.

1. Go to https://console.cloud.google.com
2. Create a project (or use existing): "SeniorProtect"
3. Enable the **Google Play Android Developer API**:
   - APIs & Services → Library → search "Google Play Android Developer API" → Enable
4. Create a Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Name: `eas-submit`
   - Role: (skip for now)
   - Create Key → JSON → download
5. Save the JSON key as `app/google-play-service-account.json`
   - **Add to .gitignore** — never commit this file
6. Link to Google Play Console:
   - Google Play Console → Settings → API access → Link your Google Cloud project
   - Grant the service account "Release manager" permission

### Step 4: Complete Store Listing

#### Main Store Listing
| Field | Value |
|-------|-------|
| App name | SeniorProtect |
| Short description (80 char) | Check suspicious emails & texts for scams. Free, private, built for seniors. |
| Full description (4000 char) | (same as iOS App Store description above) |
| App icon | 512x512 PNG (EAS generates from 1024x1024) |
| Feature graphic | 1024x500 PNG (required — banner shown at top of listing) |
| Phone screenshots | Min 2, max 8 — 1080x1920 or 1284x2778 px |
| Tablet screenshots | Optional but recommended — 2048x2732 px |

#### Feature Graphic (1024x500)
This is the banner image at the top of the Google Play listing. Design:
- App icon on the left
- "SeniorProtect" text + tagline on the right
- Navy blue background matching the icon theme
- Generate from the icon SVG source

#### Content Rating
1. Google Play Console → Policy → Content rating
2. Fill out the IARC questionnaire:
   - Violence: No
   - Sexuality: No
   - Language: No
   - Controlled substance: No
   - User interaction: No (no user-to-user chat)
3. Result should be: **Everyone** (ESRB) / **PEGI 3**

#### Data Safety
Google Play requires a Data Safety section (similar to Apple's App Privacy):

| Data Type | Collected? | Shared? | Purpose |
|-----------|-----------|---------|---------|
| Email address | Yes | No | Account management |
| Name | Yes | No | Account management |
| App interactions | Yes | No | Analytics, app functionality |
| Other user content | Yes (temporarily) | No | Core app function (scam checking) |

- Data encrypted in transit: Yes (HTTPS)
- Data deletion: Users can request deletion (Clerk account deletion)
- Complies with Families Policy: N/A (not a kids app)

#### App Category & Tags
- **Category:** Tools
- **Tags:** Security, Utilities

### Step 5: Build for Android

```bash
# Build Android App Bundle (AAB) for Google Play
eas build --platform android --profile production

# This will:
# - Build in the cloud
# - Generate a signed .aab file
# - Takes ~10-15 minutes
# - First build will prompt you to create a new Android keystore
#   (EAS manages this for you — say Yes)
```

### Step 6: Submit to Google Play

```bash
# Submit the build to Google Play (internal testing track)
eas submit --platform android --profile production

# This uses the service account key from eas.json
# Uploads to the "Internal testing" track by default
```

### Step 7: Internal Testing

1. Google Play Console → Testing → Internal testing
2. Create an email list of testers
3. Testers get an opt-in link to install from Play Store
4. No review required for internal testing

### Step 8: Production Release

1. Google Play Console → Testing → Internal testing → Promote to Production
2. Or: Production → Create new release → upload the AAB
3. Fill out:
   - Release name: "2.0.0"
   - Release notes: (same as iOS What's New)
4. Submit for review
5. Google Play review typically takes 1-3 days (first submission can take up to 7 days)

### Android-Specific Considerations

| Topic | Detail |
|-------|--------|
| **Adaptive icon** | Already configured in app.json — foreground + background color |
| **Minimum SDK** | Expo default (API 23 / Android 6.0) — covers 99%+ of devices |
| **Signing key** | EAS manages keystore automatically — download backup from EAS dashboard |
| **App Bundle** | Google requires .aab (not .apk) for Play Store — eas.json already configured |
| **Target SDK** | Expo handles — must be API 34+ for 2026 Play Store requirements |

---

## Part 5: Shared Assets Checklist

| Asset | iOS | Android | Website | Status |
|-------|-----|---------|---------|--------|
| App icon 1024x1024 | Required | Required (512x512 derived) | OG image base | DONE |
| Icon source SVG | N/A | N/A | Editable | DONE |
| Screenshots 6.7" (1290x2796) | Required | N/A | Hero mockup | Needed |
| Screenshots phone (1080x1920) | N/A | Required | Reuse | Needed |
| Feature graphic (1024x500) | N/A | Required | Can reuse as banner | Needed |
| OG image (1200x630) | N/A | N/A | Required | Needed |
| Privacy policy page | Required URL | Required URL | Required | Needed |
| Terms of service page | Required URL | N/A (recommended) | Required | Needed |
| Support page | Required URL | Required URL | Required | Needed |
| App description | Required | Required | Landing page copy | DONE |
| Keywords | Required (100 char) | N/A (indexed from description) | Meta tags | DONE |
| What's New text | Required | Required | N/A | DONE |

---

## Part 6: Version Strategy

| Version | Platform | Track | Purpose |
|---------|----------|-------|---------|
| 2.0.0 Build 1 | iOS | TestFlight (internal) | Immediate — team testing |
| 2.0.0 Build 1 | Android | Internal testing | After Google Play account setup |
| 2.0.0 | iOS | App Store (production) | Submit during TestFlight testing |
| 2.0.0 | Android | Production | Submit after iOS approved |

**Why version 2.0.0:**
- Positions the app as mature, not a v1 experiment
- Implies prior iteration and improvement
- Higher perceived trust from seniors and their families

**EAS version management:**
- `eas.json` has `"appVersionSource": "remote"` — EAS auto-increments build numbers
- Version string (2.0.0) set in `app.json`
- Each `eas build` increments the build number automatically

---

## Part 7: Implementation Order

### Phase A: Foundation (Day 1)
1. [x] Generate app icon (SP shield, red/white/blue)
2. [x] Update app.json to version 2.0.0
3. [x] Update eas.json with Android + TestFlight config
4. [ ] Create `seniorprotect-site` repo on GitHub
5. [ ] `npx create-next-app@latest` with Tailwind + App Router
6. [ ] Set up Cloudflare DNS records (CNAME for Vercel, MX for email)
7. [ ] Deploy to Vercel, verify https://seniorprotect.ai works

### Phase B: Required Pages (Day 1-2)
8. [ ] Privacy Policy page (real legal content)
9. [ ] Terms of Service page
10. [ ] Support page with FAQ + contact email
11. [ ] Deploy — these pages unblock BOTH store submissions

### Phase C: App Store Prep (Day 2)
12. [ ] Create app in App Store Connect
13. [ ] Run `eas build --platform ios --profile production`
14. [ ] Configure TestFlight — add internal testers
15. [ ] Share TestFlight link
16. [ ] Take iOS screenshots in Simulator (6.7" and 6.5")
17. [ ] Frame screenshots with captions
18. [ ] Fill out App Store listing (all metadata from this doc)
19. [ ] Submit v2.0.0 for App Store review

### Phase D: Google Play Prep (Day 2-3)
20. [ ] Create Google Play Developer account ($25)
21. [ ] Complete identity verification
22. [ ] Create Cloud project + service account key
23. [ ] Create app in Google Play Console
24. [ ] Generate feature graphic (1024x500)
25. [ ] Run `eas build --platform android --profile production`
26. [ ] Run `eas submit --platform android`
27. [ ] Set up internal testing track
28. [ ] Fill out store listing + data safety
29. [ ] Complete content rating questionnaire

### Phase E: Landing Page (Day 3-4)
30. [ ] Build Hero section with phone mockup + TestFlight link
31. [ ] Build How It Works section
32. [ ] Build Features grid
33. [ ] Build Three Questions explainer
34. [ ] Build Email Forwarding CTA section
35. [ ] Build Footer with all required links
36. [ ] Add SEO metadata, OG image
37. [ ] Mobile-responsive pass

### Phase F: Polish & Launch (Day 4-5)
38. [ ] Update website with App Store link (once approved)
39. [ ] Add Google Play badge (once approved)
40. [ ] QR codes on website
41. [ ] Vercel Analytics setup
42. [ ] Test OG image / social sharing
43. [ ] Submit Android to production track

---

## Files Modified in This Plan

| File | Change |
|------|--------|
| `app/assets/icon-source.svg` | NEW — editable icon source |
| `app/assets/icon.png` | REPLACED — 1024x1024 SP shield |
| `app/assets/adaptive-icon.png` | REPLACED — Android adaptive icon |
| `app/assets/favicon.png` | REPLACED — 48x48 |
| `app/assets/splash-icon.png` | REPLACED — 200x200 |
| `app/app.json` | Version → 2.0.0, splash bg → #0D2240 |
| `app/eas.json` | Added Android config, preview profile |
| `app/.gitignore` | Needs: google-play-service-account.json |

---

## Quick Reference Commands

```bash
# === iOS ===
# Build for TestFlight / App Store
eas build --platform ios --profile production

# Submit to App Store (after build completes)
eas submit --platform ios --profile production

# === Android ===
# Build for Google Play
eas build --platform android --profile production

# Submit to Google Play internal testing
eas submit --platform android --profile production

# === Both platforms at once ===
eas build --platform all --profile production

# === Check build status ===
eas build:list

# === Local development ===
cd app && npx expo start --clear
```
