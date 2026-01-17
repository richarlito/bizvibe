# BizVibe - System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              BIZVIBE SYSTEM ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│   CLIENTS                                                                               │
│   ───────                                                                               │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │   iOS App    │    │ Android App  │    │  Web Admin   │    │  Web Dash    │        │
│   │  (Expo/RN)   │    │  (Expo/RN)   │    │  (Next.js)   │    │  (Next.js)   │        │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘        │
│          │                   │                   │                   │                 │
│          └───────────────────┼───────────────────┼───────────────────┘                 │
│                              │                   │                                     │
│   ───────────────────────────┼───────────────────┼─────────────────────────────────── │
│                              │                   │                                     │
│   API GATEWAY                ▼                   ▼                                     │
│   ───────────   ┌────────────────────────────────────────────────────┐                │
│                 │              SUPABASE                               │                │
│                 │  ┌────────────────────────────────────────────┐    │                │
│                 │  │              API Layer                      │    │                │
│                 │  │    REST + Realtime WebSocket + Auth        │    │                │
│                 │  └────────────────────────────────────────────┘    │                │
│                 └────────────────────────────────────────────────────┘                │
│                              │                                                         │
│   ───────────────────────────┼─────────────────────────────────────────────────────── │
│                              │                                                         │
│   SERVICES                   │                                                         │
│   ────────   ┌───────────────┼───────────────┬───────────────┬───────────────┐        │
│              │               │               │               │               │        │
│              ▼               ▼               ▼               ▼               ▼        │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│   │   Supabase   │ │   Supabase   │ │   Supabase   │ │    Edge      │ │   Supabase   ││
│   │     Auth     │ │   Database   │ │   Storage    │ │  Functions   │ │   Realtime   ││
│   │              │ │  (Postgres)  │ │              │ │   (Deno)     │ │              ││
│   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                                        │
│   ───────────────────────────────────────────────────────────────────────────────────  │
│                                                                                        │
│   EXTERNAL SERVICES                                                                    │
│   ─────────────────                                                                    │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│   │     Mux      │ │    Stripe    │ │  Expo Push   │ │    Sentry    │                 │
│   │   (Video)    │ │  (Payments)  │ │(Notifications)│ │  (Errors)    │                 │
│   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘                 │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### Video Upload Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mobile    │───▶│  Supabase   │───▶│  Mux Direct │───▶│    Mux      │
│    App      │    │   Storage   │    │   Upload    │    │  Processing │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
                         ┌──────────────────────────────────────┘
                         ▼
            ┌─────────────────────────┐    ┌─────────────────────────┐
            │       Webhook           │───▶│   Update Database       │
            │   (video.ready)         │    │   (status, playback_id) │
            └─────────────────────────┘    └─────────────────────────┘
```

### Video Playback Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mobile    │───▶│  Supabase   │───▶│    Get      │
│    App      │    │   Query     │    │  Video URL  │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
                         ┌───────────────────┘
                         ▼
            ┌─────────────────────────┐
            │   Mux CDN Streaming     │
            │   (HLS adaptive)        │
            └─────────────────────────┘
```

### Payment Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mobile    │───▶│   Edge      │───▶│   Stripe    │───▶│   Payment   │
│    App      │    │  Function   │    │   Connect   │    │   Intent    │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
         ┌──────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│   Client Confirmation   │───▶│       Webhook           │
│   (Payment Sheet)       │    │   (payment_succeeded)   │
└─────────────────────────┘    └───────────┬─────────────┘
                                           │
                   ┌───────────────────────┘
                   ▼
      ┌─────────────────────────┐
      │   Create Order Record   │
      │   Split to Business     │
      └─────────────────────────┘
```

### Real-time Messaging Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Sender     │───▶│  Supabase   │───▶│   Insert    │
│   (User)    │    │   Client    │    │   Message   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
                         ┌───────────────────┘
                         ▼
            ┌─────────────────────────┐
            │  Supabase Realtime      │
            │  (WebSocket broadcast)  │
            └───────────┬─────────────┘
                        │
                        ▼
            ┌─────────────────────────┐
            │   Receiver (Business)   │
            │   Gets instant update   │
            └─────────────────────────┘
```

---

## API Structure

### Supabase REST API
```
Base URL: https://[project].supabase.co/rest/v1

Endpoints (auto-generated from schema):
├── /profiles       - User profiles
├── /businesses     - Business accounts
├── /videos         - Video content
├── /products       - Products/services
├── /orders         - Orders
├── /order_items    - Order line items
├── /conversations  - Chat threads
├── /messages       - Chat messages
├── /saves          - User saves/wishlist
├── /follows        - User follows
├── /reviews        - Business reviews
└── /categories     - Content categories
```

### Edge Functions
```
POST /functions/v1/create-upload-url     - Mux direct upload
POST /functions/v1/create-payment-intent - Stripe payment
POST /functions/v1/stripe-webhook        - Stripe webhooks
POST /functions/v1/mux-webhook           - Mux webhooks
POST /functions/v1/send-notification     - Push notifications
GET  /functions/v1/feed                  - Personalized feed
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CLIENT                                                             │
│  ├── HTTPS/TLS encryption in transit                               │
│  ├── Secure token storage (Keychain/Keystore)                      │
│  └── Certificate pinning (production)                              │
│                                                                     │
│  AUTHENTICATION                                                     │
│  ├── Supabase Auth (JWT tokens)                                    │
│  ├── Social OAuth (Google, Apple)                                  │
│  ├── Token refresh (auto)                                          │
│  └── Session management                                            │
│                                                                     │
│  AUTHORIZATION                                                      │
│  ├── Row-Level Security (RLS) on all tables                        │
│  ├── Role-based access (consumer, business, admin)                 │
│  └── Resource ownership validation                                 │
│                                                                     │
│  DATA                                                               │
│  ├── Encryption at rest (Supabase managed)                         │
│  ├── Encrypted backups                                             │
│  └── PII minimization                                              │
│                                                                     │
│  PAYMENTS                                                           │
│  ├── Stripe handles PCI compliance                                 │
│  ├── No card data stored on our servers                            │
│  └── Webhook signature verification                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Scalability Architecture

### Current (MVP)
- Supabase Free/Pro tier
- Mux starter usage
- Single region

### Growth (10K-100K users)
- Supabase Pro tier
- Connection pooling (PgBouncer)
- Read replicas if needed
- CDN for static assets

### Scale (100K+ users)
- Supabase Enterprise
- Multiple regions
- Custom caching layer
- Advanced video optimization

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ERROR TRACKING                                                     │
│  └── Sentry (mobile + edge functions)                              │
│                                                                     │
│  ANALYTICS                                                          │
│  └── Amplitude (user events, funnels)                              │
│                                                                     │
│  INFRASTRUCTURE                                                     │
│  └── Supabase Dashboard (DB, API, Auth metrics)                    │
│                                                                     │
│  VIDEO                                                              │
│  └── Mux Data (video performance, quality)                         │
│                                                                     │
│  PAYMENTS                                                           │
│  └── Stripe Dashboard (transactions, disputes)                     │
│                                                                     │
│  CUSTOM METRICS                                                     │
│  └── Amplitude (business metrics, KPIs)                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT FLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MOBILE APP                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐         │
│  │  Code   │───▶│  EAS    │───▶│  Test   │───▶│  App    │         │
│  │  Push   │    │  Build  │    │  Flight │    │  Store  │         │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘         │
│                                                                     │
│  OTA UPDATES (non-native changes)                                   │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                        │
│  │  Code   │───▶│  EAS    │───▶│  Users  │                        │
│  │  Push   │    │ Update  │    │  Auto   │                        │
│  └─────────┘    └─────────┘    └─────────┘                        │
│                                                                     │
│  BACKEND                                                            │
│  ┌─────────┐    ┌─────────┐                                        │
│  │ Supabase│───▶│ Staging │───▶ Production                        │
│  │ CLI Push│    │  Test   │                                        │
│  └─────────┘    └─────────┘                                        │
│                                                                     │
│  WEB DASHBOARD                                                      │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                        │
│  │  Code   │───▶│ Vercel  │───▶│ Preview │───▶ Production         │
│  │  Push   │    │  Build  │    │  Deploy │                        │
│  └─────────┘    └─────────┘    └─────────┘                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
