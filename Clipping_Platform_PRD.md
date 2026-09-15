# Product Requirements Document: ClipYard
### A Clipping Marketplace Platform (Whop-style) — React + Supabase

**Version:** 1.0 (MVP scope)
**Prepared:** September 2, 2026
**Stack:** React (frontend) · Supabase (Postgres, Auth, Storage, Edge Functions, Realtime) · Stripe (payments)

> Working name "ClipYard" used throughout for readability — swap for your final brand.

---

## 1. Overview

A **clipping platform** connects two sides of a market:
- **Campaign creators** ("brands") — streamers, podcasters, YouTubers, or businesses who want short clips of their long-form content (streams, podcasts, videos) cut and posted to TikTok, Instagram Reels, and YouTube Shorts to drive views/reach.
- **Clippers** — creators who cut, edit, and post those clips to their own or campaign-provided social accounts, competing to generate views. They get paid based on performance (usually **$ per 1,000 views**, i.e., CPM-based payouts).

This is the same business model widely run today *on top of* Whop (as a paid community + manual tracking), but built as a **dedicated product**: automated view tracking, escrow-based campaign budgets, submission review, leaderboards, and direct payouts — removing the manual spreadsheet/Discord-bot tracking that most clipping communities rely on today.

## 2. Problem Statement

Today's clipping communities (mostly run inside Discord + Whop) suffer from:
- **Manual view tracking** — organizers copy/paste link stats into spreadsheets or bots.
- **Trust issues** — clippers don't know if payouts are calculated fairly; brands don't know if view counts are inflated/bot-driven.
- **No escrow** — brands can under-pay or disappear after clips go viral; clippers have no guarantee of payment.
- **Fragmented submission flow** — links dropped in Discord channels with no structured review/approval pipeline.
- **No standardized leaderboard/reputation system** across campaigns for top clippers to build a track record.

## 3. Goals

| Goal | Description |
|---|---|
| Automate view tracking | Pull live view counts from TikTok, YouTube, Instagram via API/scraping rather than manual entry. |
| Guarantee payment trust | Brands fund campaign budgets **up front into escrow**; clippers are paid automatically once views are verified. |
| Structured submission → review → payout pipeline | Replace ad-hoc Discord link-dropping with a proper workflow and audit trail. |
| Build clipper reputation | Public leaderboards and profile stats (total views generated, campaigns completed, earnings) to reward top performers and help brands pick trusted clippers. |
| Low operational overhead | Supabase-first architecture (Postgres + RLS + Edge Functions + Realtime) so a small team can run this without heavy backend infrastructure. |

## 4. Personas

1. **Brand / Campaign Owner** — streamer, podcaster, or business. Creates campaigns, funds budget, sets rules (rate per 1K views, allowed platforms, content guidelines, caps), reviews/approves clip submissions, monitors spend in real time.
2. **Clipper** — submits clips against open campaigns, tracks their own view counts/earnings, withdraws funds, builds a public reputation.
3. **Platform Admin** — moderates disputes, reviews flagged/suspicious view activity (bot views), manages payouts/fees, handles KYC for withdrawals.
4. **(Optional, Phase 2) Agency** — manages multiple brands' campaigns and multiple clippers on their behalf (roll-up view for agencies running clipping ops as a service).

## 5. MVP Scope

**In scope for MVP:**
- Auth (Supabase Auth: email + OAuth for Google/Discord)
- Campaign creation & funding (Stripe → escrow balance)
- Clip submission (link + platform selector)
- Semi-automated view tracking (scheduled Edge Function polling public APIs/oEmbed endpoints per platform)
- Manual admin approval step for first-version fraud control
- Payout calculation engine (rate × verified views, capped at campaign budget)
- Clipper wallet + withdrawal to bank/PayPal via Stripe Connect
- Campaign & clipper dashboards
- Leaderboard (global + per-campaign)
- Basic notifications (email + in-app)

**Explicitly out of scope for MVP** (see §14): native mobile apps, in-app video editor, agency multi-brand tooling, AI-generated clip suggestions, dispute-resolution UI (handled manually by admin at launch).

## 6. Detailed Feature Requirements

### 6.1 Authentication & Roles
- FR-1: Users sign up/sign in via Supabase Auth (email/password + Google + Discord OAuth).
- FR-2: A user can hold one or both roles — `brand` and `clipper` — on the same account (role stored per-user, not exclusive).
- FR-3: Admin role assigned manually via a `is_admin` flag; not self-service.

### 6.2 Campaign Management (Brand side)
- FR-4: Brand creates a campaign with: title, description, source content (link/upload), allowed platforms (TikTok/Reels/Shorts), rate per 1,000 views, total budget, max payout per clip, content guidelines, start/end dates.
- FR-5: Brand must fund the campaign budget via Stripe **before** the campaign goes live (funds held in platform escrow, not brand's own account).
- FR-6: Brand can pause, extend, or end a campaign early (unspent escrow refunded minus any platform fee already earned).
- FR-7: Brand dashboard shows real-time spend, remaining budget, submissions pending review, and top-performing clips.

### 6.3 Clip Submission (Clipper side)
- FR-8: Clipper browses open campaigns (filterable by rate, platform, category, budget remaining).
- FR-9: Clipper submits a clip by pasting the public post URL (TikTok/Reels/Shorts) against a specific campaign.
- FR-10: System validates the URL belongs to an allowed platform and is publicly viewable before accepting submission.
- FR-11: Submission enters `pending_review` status; brand (or admin, if brand delegates) approves or rejects with a reason.
- FR-12: Once approved, submission enters `tracking` status and begins scheduled view-count polling.

### 6.4 View Tracking Engine
- FR-13: A scheduled Supabase Edge Function (via `pg_cron` or external scheduler) polls each tracked submission's view count on a fixed interval (e.g., every 6–12 hours), platform APIs/oEmbed permitting.
- FR-14: Each poll writes a `view_snapshot` row (submission_id, view_count, captured_at) — never overwrites, so history/growth is always auditable.
- FR-15: Payable views = `latest_verified_view_count`, subject to anti-fraud checks (§6.6).
- FR-16: If a platform's official API doesn't expose reliable public view counts (a known constraint for some platforms), system falls back to periodic scraping of the public post page or requires manual admin re-verification — flagged clearly in the UI as "self-reported, pending verification."

### 6.5 Payouts & Wallet
- FR-17: Earnings per submission = `(verified_views / 1000) × campaign_rate`, capped at the submission's max payout and the campaign's remaining budget (first-verified, first-paid ordering once budget is exhausted).
- FR-18: Verified earnings accrue to the clipper's in-app **wallet balance** (ledger table, not just a running number).
- FR-19: Clipper can request withdrawal once balance exceeds a minimum threshold; payout processed via **Stripe Connect** (Express accounts) to bank/debit card.
- FR-20: Platform takes a configurable fee (e.g., % of campaign budget or % of payout) — recorded transparently as a line item in both brand and clipper transaction history.

### 6.6 Anti-Fraud / Integrity Controls
- FR-21: System flags submissions with abnormal view-growth velocity (possible bot views) for manual admin review before payout release.
- FR-22: Duplicate-URL detection prevents the same clip being submitted to multiple campaigns or by multiple users.
- FR-23: Admin can freeze a submission's payout and request the clipper provide proof of organic growth (e.g., platform analytics screenshot) before releasing funds.

### 6.7 Leaderboards & Reputation
- FR-24: Global leaderboard ranks clippers by total verified views / total earnings (weekly, monthly, all-time toggles).
- FR-25: Per-campaign leaderboard shown to the brand and publicly to encourage competition.
- FR-26: Clipper public profile shows completed campaigns, total views generated, and (optionally, opt-in) total earnings.

### 6.8 Notifications
- FR-27: Email + in-app notifications for: submission approved/rejected, payout released, campaign budget running low (brand alert), campaign ending soon, withdrawal completed.

### 6.9 Admin Console
- FR-28: Admin can view all campaigns, submissions, and flagged fraud cases; override approval/rejection; manually adjust a view count with an audit note if a platform API fails.
- FR-29: Admin can view platform-wide financial reporting (total escrow held, total paid out, total fees earned).

## 7. Core User Flows

**7.1 Brand: Launch a campaign**
1. Sign up → select "Brand" role → verify email.
2. Create campaign (content, rate, guidelines, budget).
3. Fund budget via Stripe checkout → funds move to escrow.
4. Campaign goes live and appears in the public campaign feed.
5. Review incoming submissions → approve/reject.
6. Monitor spend and leaderboard in real time via Supabase Realtime-powered dashboard.

**7.2 Clipper: Submit and get paid**
1. Sign up → select "Clipper" role.
2. Browse open campaigns → pick one matching their niche/platform.
3. Post the clip on their own social account per campaign guidelines.
4. Submit the public post link.
5. Wait for brand approval → tracking begins.
6. Watch wallet balance grow as views accrue (visible in real time).
7. Request withdrawal once above the minimum threshold → Stripe Connect payout.

**7.3 Admin: Handle a fraud flag**
1. System auto-flags a submission for abnormal view velocity.
2. Admin reviews the view-snapshot history graph for the submission.
3. Admin either clears the flag (payout resumes) or contacts the clipper for proof, freezing payout in the interim.

## 8. Technical Architecture

```
┌─────────────────────────┐        ┌───────────────────────────────┐
│        Frontend          │        │            Supabase             │
│  React + Vite + Tailwind │◄──────►│  Postgres (RLS-enforced)        │
│  React Router, TanStack  │  REST/ │  Auth (email + OAuth)           │
│  Query, Zustand/Context  │  RPC/  │  Storage (thumbnails, proofs)   │
│  Supabase JS client      │Realtime│  Realtime (campaign/wallet subs)│
└─────────────────────────┘        │  Edge Functions (Deno)          │
                                    │   - view-poller (cron)          │
                                    │   - payout-calculator           │
                                    │   - stripe-webhook-handler      │
                                    └───────────────┬─────────────────┘
                                                     │
                                    ┌────────────────┴────────────────┐
                                    │        External Services         │
                                    │  Stripe (Checkout + Connect)      │
                                    │  TikTok / YouTube / IG Graph APIs │
                                    │  (+ scraping fallback service)    │
                                    └────────────────────────────────────┘
```

- **Frontend:** React (Vite) SPA, Tailwind CSS + shadcn/ui for components, TanStack Query for data fetching/cache, Supabase JS client for auth/data/realtime subscriptions, React Router for routing.
- **Backend:** Supabase as the primary backend — Postgres for all relational data, Row Level Security (RLS) policies enforcing that brands only see their campaigns, clippers only see their submissions/wallet, and admins bypass via a service role.
- **Edge Functions (Deno, on Supabase):**
  - `poll-views` — scheduled job hitting platform APIs/oEmbed/scraping fallback, writing `view_snapshots`.
  - `calculate-payouts` — runs after each poll, updates wallet ledgers based on verified views and remaining budget.
  - `stripe-webhook` — handles `checkout.session.completed` (campaign funding) and Connect payout events.
- **Payments:** Stripe Checkout for brand funding; Stripe Connect (Express) for clipper payouts; Stripe handles KYC for payout recipients.
- **Hosting:** Frontend on Vercel/Netlify; Supabase Cloud for backend; no separate server needed for MVP.

## 9. Database Schema (core tables)

| Table | Key columns |
|---|---|
| `users` | id, email, display_name, roles[] (brand/clipper), stripe_customer_id, stripe_connect_id, is_admin, created_at |
| `campaigns` | id, brand_id (fk users), title, description, source_url, rate_per_1000, total_budget, remaining_budget, max_payout_per_clip, allowed_platforms[], guidelines, status (draft/active/paused/ended), starts_at, ends_at |
| `submissions` | id, campaign_id (fk), clipper_id (fk users), post_url, platform, status (pending_review/approved/rejected/tracking/completed/flagged), submitted_at, reviewed_at |
| `view_snapshots` | id, submission_id (fk), view_count, captured_at |
| `wallets` | id, user_id (fk, unique), balance, created_at, updated_at |
| `transactions` | id, wallet_id (fk), type (earning/withdrawal/fee), amount, related_submission_id, related_campaign_id, status, created_at |
| `withdrawals` | id, user_id (fk), amount, stripe_transfer_id, status (pending/paid/failed), requested_at, paid_at |
| `fraud_flags` | id, submission_id (fk), reason, status (open/cleared/confirmed), admin_id, created_at, resolved_at |

**RLS approach:**
- `campaigns`: SELECT public for `status = 'active'`; INSERT/UPDATE restricted to `brand_id = auth.uid()`.
- `submissions`: clipper can INSERT/SELECT their own; brand can SELECT/UPDATE submissions where `campaign_id` belongs to them.
- `wallets`/`transactions`: strictly `user_id = auth.uid()`, admin service role bypasses for support/audits.

## 10. Non-Functional Requirements

- **Data integrity:** View snapshots are append-only (never mutated) to preserve a full audit trail for disputes.
- **Consistency under budget caps:** Payout calculation must be atomic (Postgres transaction) to prevent overspending a campaign's budget under concurrent submissions hitting the cap simultaneously.
- **Security:** All monetary mutations happen server-side (Edge Functions with service role), never directly from the client, even though Supabase allows client writes — client should only ever read wallet/campaign state and trigger actions via RPC/Edge Function calls.
- **Rate limits & API quotas:** View-polling frequency must respect each platform's API rate limits; design polling in batches with backoff.
- **Auditability:** Every payout, fraud flag, and admin override must be logged with an actor and timestamp.
- **Scalability:** Polling architecture should horizontally scale (batch queue) as submission volume grows beyond a few thousand active tracked clips.

## 11. Success Metrics (KPIs)

| Metric | Purpose |
|---|---|
| Total campaign budget funded (GMV) | Core growth metric |
| Active campaigns / active clippers (weekly) | Marketplace liquidity |
| Avg. time from submission → approval | Brand-side UX health |
| % of views auto-verified vs. manually reviewed | Automation/API reliability |
| Fraud-flag rate & false-positive rate | Trust & integrity health |
| Payout cycle time (verified view → funds in bank) | Clipper-side trust/UX |
| Take-rate revenue | Platform monetization |

## 12. Risks & Open Questions

- **Platform API access:** TikTok, Instagram, and YouTube all restrict or gate reliable public view-count access differently; some may require official API partnerships, others only scraping (fragile, ToS-risk). This is the single biggest technical risk to validate before building.
- **Bot/fake views:** Payout-per-view models are a known target for view-botting; the fraud-flag system needs to be a first-class feature, not an afterthought.
- **Payout compliance:** Cross-border payouts via Stripe Connect require KYC and vary by country — plan for regions where Stripe Connect isn't supported.
- **Content rights/liability:** Brand must own or license rights to the source content being clipped; platform should require brand to confirm rights at campaign creation to limit liability exposure.
- **Dispute resolution at scale:** MVP handles disputes manually via admin — will need a structured in-app dispute flow before scaling past a small admin team's capacity.

## 13. Phased Roadmap

| Phase | Scope |
|---|---|
| **MVP** | Everything in §5 — manual-assist view tracking, single-platform Stripe payouts, admin-run fraud review. |
| **V1.1** | Official API integrations (where available) to reduce manual/scraped tracking; automated fraud scoring model. |
| **V1.2** | In-app dispute resolution flow; clipper reputation badges/tiers. |
| **V2** | Agency accounts (multi-brand management); AI-suggested clip moments from source content; native mobile app. |

## 14. Out of Scope (MVP)

- In-browser video editing/clipping tools (clippers use external editors)
- Native iOS/Android apps
- AI auto-generation of clips from source video
- Agency/multi-brand account management
- In-app real-time chat between brand and clipper (use email/notifications only)

---
*This PRD assumes a small-team build (1–3 engineers) using Supabase to minimize backend infrastructure overhead. Before implementation, validate platform API access (TikTok/IG/YouTube view-count availability) — this determines whether §6.4 is fully automatable at MVP or requires a manual-review fallback as the primary path.*
