# Email Forwarding Check Feature

**Date:** 2026-02-10
**Status:** Planning
**Goal:** Seniors forward suspicious emails to `check@seniorprotect.app` and receive a safe/caution/danger reply — no app required.

---

## Why This Matters

- Works from any device (phone, tablet, desktop)
- Uses a workflow seniors already know (forwarding email)
- Zero friction — no login, no app install
- Family members can tell grandma: "Just forward it to check@seniorprotect.app"

---

## Architecture

```
Senior forwards email to check@seniorprotect.app
  -> Cloudflare Email Worker receives it
  -> Worker extracts headers + body, POSTs to our API
  -> POST /api/v1/inbound/email on Render server
  -> Server parses forwarded content (original sender, subject, body, URLs)
  -> Runs existing analysis pipeline (patternMatcher, urlAnalyzer, scoringAlgorithm)
  -> Formats result as senior-friendly HTML email
  -> Sends reply via Resend to the forwarding sender's address
```

---

## Infrastructure: Cloudflare Email Workers

### Why Cloudflare
- Free (no per-email cost)
- Already battle-tested email infrastructure
- Email Workers run on the edge, very fast
- Simple setup: MX record + Worker script
- No extra services to manage

### Setup Steps

1. **Add domain to Cloudflare** (if not already): `seniorprotect.app` or use a subdomain
2. **Enable Email Routing** in Cloudflare dashboard → Email → Email Routing
3. **Create Email Worker** that catches `check@seniorprotect.app`
4. **MX records** are auto-configured by Cloudflare Email Routing

### Cloudflare Worker Code (conceptual)

```typescript
// workers/email-inbound.ts
export default {
  async email(message: EmailMessage, env: Env) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get('subject') || '';

    // Read the raw email body
    const rawBody = await new Response(message.raw).text();

    // POST to our API
    const response = await fetch(`${env.API_URL}/api/v1/inbound/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': env.WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        rawBody,
      }),
    });

    if (!response.ok) {
      // Cloudflare will retry on failure
      message.setReject('Processing failed');
    }
  },
};
```

---

## Server Implementation

### New Route: `POST /api/v1/inbound/email`

**File:** `server/src/routes/inbound.ts`

```typescript
router.post('/email', async (req, res) => {
  // 1. Validate webhook secret
  // 2. Rate-limit by sender address (10/hour)
  // 3. Parse the forwarded email content
  // 4. Run analysis pipeline
  // 5. Send reply via Resend
  // 6. Log the check (hashed, no raw content stored)
});
```

### Forwarded Email Parser

**File:** `server/src/services/forwardedEmailParser.ts`

Different email clients format forwards differently. We need to handle the major ones:

| Client | Forward Marker |
|--------|---------------|
| Gmail | `---------- Forwarded message ----------` |
| Outlook | `From: ...\nSent: ...\nTo: ...\nSubject: ...` |
| Apple Mail | `Begin forwarded message:` |
| Yahoo | `--- Forwarded Message ---` |

The parser extracts:
- **Original sender** (from the forwarded headers)
- **Original subject** (from the forwarded headers)
- **Body text** (everything after the forwarded headers)
- **URLs** found in the body (for URL analysis)

If parsing fails (unusual format), fall back to analyzing the entire email body as-is — the analysis engine works on raw text anyway.

### Analysis Pipeline (existing)

The forwarded content runs through the same pipeline used by `POST /api/v1/check/email`:
- `patternMatcher` — scam phrase detection
- `urlAnalyzer` — checks URLs against trusted sites, suspicious patterns
- `scoringAlgorithm` — aggregates signals into safe/caution/danger

### Reply Email Template

Senior-friendly HTML email with:
- Large text (18px+)
- Clear color-coded result: green (safe), yellow (caution), red (danger)
- The "Three Questions" framework:
  - **Who is this from?** (original sender analysis)
  - **What do they want?** (intent summary)
  - **Should I trust this?** (recommendation)
- Simple action advice ("This looks safe" / "Be careful" / "Do not respond to this")
- Link to the app for more details (optional)

---

## Rate Limiting & Abuse Prevention

| Rule | Limit |
|------|-------|
| Per sender address | 10 emails/hour, 30/day |
| Global inbound | 1,000/day (circuit breaker) |
| Max email size | 1 MB (reject larger) |
| Reply-to validation | Must be a real email, not a no-reply |

Store rate limit counters in Redis (already running).

---

## Privacy & Data Handling

- **Never store raw forwarded email content** — hash it (SHA-256) after analysis
- Log only: sender hash, timestamp, threat level, analysis score
- Auto-delete inbound logs after 90 days (matches existing policy)
- The Cloudflare Worker does not store anything — it's a pass-through

---

## Cost Projection

| Component | Monthly Cost |
|-----------|-------------|
| Cloudflare Email Workers | $0 |
| Cloudflare Email Routing | $0 |
| Resend outbound replies (free tier: 3,000/mo) | $0 |
| Resend outbound (10K/mo) | $20 |
| Server processing (already on Render) | $0 incremental |
| Redis rate limiting (already running) | $0 incremental |
| **Total at launch** | **$0** |
| **Total at 10K emails/month** | **$20** |

---

## Domain Decision

**Option A:** `check@seniorprotect.app` (if we own this domain)
**Option B:** `check@protect.servicevision.net` (subdomain of existing domain)

Option A is better for branding and simplicity — seniors need to remember one easy address.

---

## Files to Create/Modify

| File | Change |
|------|--------|
| `workers/email-inbound.ts` | NEW — Cloudflare Worker (separate deploy) |
| `workers/wrangler.toml` | NEW — Worker config |
| `server/src/routes/inbound.ts` | NEW — webhook endpoint |
| `server/src/services/forwardedEmailParser.ts` | NEW — parse forwarded emails |
| `server/src/services/emailReplyTemplates.ts` | NEW — HTML reply templates |
| `server/src/routes/index.ts` | Add inbound route |
| Cloudflare Dashboard | Email Routing config |
| DNS | MX records (auto by Cloudflare) |

---

## Implementation Order

1. **Forwarded email parser** + unit tests (can build/test without any infra)
2. **Reply email template** (design the HTML, test with Resend)
3. **Inbound route** with rate limiting
4. **Cloudflare Worker** + wrangler config
5. **DNS/Email Routing** setup in Cloudflare dashboard
6. **End-to-end test** — forward a real email, verify reply arrives

---

## Open Questions

- [ ] Do we own `seniorprotect.app` or need to register it?
- [ ] Is Cloudflare already managing DNS for the domain we'll use?
- [ ] Should we support "reply to the reply" for follow-up questions? (probably not for v1)
- [ ] Do we want to store analysis results so the user can see them in the app later? (requires matching email to user account — skip for v1)
