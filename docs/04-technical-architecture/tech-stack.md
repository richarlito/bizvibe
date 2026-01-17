# BizVibe - Technology Stack

## Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BIZVIBE TECH STACK                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CLIENT LAYER                                                               │
│  ─────────────                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   iOS App       │  │  Android App    │  │   Web Dashboard │             │
│  │   (Expo)        │  │    (Expo)       │  │   (Next.js)     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│            │                   │                    │                       │
│            └───────────────────┼────────────────────┘                       │
│                                │                                            │
│  ──────────────────────────────┼────────────────────────────────────────── │
│                                │                                            │
│  BACKEND LAYER                 ▼                                            │
│  ─────────────   ┌─────────────────────────────┐                           │
│                  │        SUPABASE              │                           │
│                  │  ┌──────────┬──────────┐    │                           │
│                  │  │ Auth     │ Database │    │                           │
│                  │  │          │ (Postgres)│    │                           │
│                  │  ├──────────┼──────────┤    │                           │
│                  │  │ Storage  │ Realtime │    │                           │
│                  │  │          │          │    │                           │
│                  │  ├──────────┴──────────┤    │                           │
│                  │  │   Edge Functions    │    │                           │
│                  │  └─────────────────────┘    │                           │
│                  └─────────────────────────────┘                           │
│                                │                                            │
│  ──────────────────────────────┼────────────────────────────────────────── │
│                                │                                            │
│  EXTERNAL SERVICES             ▼                                            │
│  ─────────────────  ┌─────────────────────────────┐                        │
│                     │  ┌─────┐ ┌──────┐ ┌──────┐  │                        │
│                     │  │ Mux │ │Stripe│ │ Expo │  │                        │
│                     │  │Video│ │Pay   │ │ Push │  │                        │
│                     │  └─────┘ └──────┘ └──────┘  │                        │
│                     └─────────────────────────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Technologies

### Mobile App (iOS & Android)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | SDK 50+ | React Native framework |
| **React Native** | 0.73+ | Cross-platform UI |
| **TypeScript** | 5.0+ | Type safety |
| **Expo Router** | 3.0+ | File-based navigation |
| **TanStack Query** | 5.0+ | Data fetching/caching |
| **Zustand** | 4.0+ | State management |
| **expo-av** | - | Video playback |
| **expo-camera** | - | Video recording |
| **FlashList** | - | High-performance lists |

### Backend (Supabase)

| Service | Purpose |
|---------|---------|
| **Supabase Auth** | User authentication |
| **Supabase Database** | PostgreSQL with RLS |
| **Supabase Storage** | File/image storage |
| **Supabase Realtime** | Live messaging |
| **Supabase Edge Functions** | Serverless compute |
| **PostGIS** | Location queries |

### Web Dashboard (Phase 2)

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework |
| **Vercel** | Hosting |
| **Tailwind CSS** | Styling |
| **Recharts** | Analytics charts |

### External Services

| Service | Purpose | Cost Model |
|---------|---------|------------|
| **Mux** | Video processing & CDN | Usage-based |
| **Stripe Connect** | Marketplace payments | 2.9% + $0.30 |
| **Expo EAS** | Builds & OTA updates | $99/mo |
| **Sentry** | Error tracking | Usage-based |
| **Amplitude** | Product analytics | Free tier |

---

## Architecture Decisions

### Why Expo + React Native?
- Single codebase for iOS & Android
- OTA updates without app store review
- Excellent video handling with expo-av
- Strong ecosystem and tooling
- Faster development cycle

### Why Supabase?
- Built-in auth, database, storage, realtime
- PostgreSQL with full SQL access
- Row-Level Security for data protection
- Edge Functions for custom logic
- 70% faster development vs. custom backend

### Why Mux for Video?
- Best-in-class video infrastructure
- Adaptive bitrate streaming
- Automatic transcoding
- Global CDN delivery
- Simple API integration

### Why Stripe Connect?
- Industry standard for marketplaces
- Built-in compliance (PCI, etc.)
- Split payments to businesses
- Comprehensive APIs
- Strong fraud prevention

---

## Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Mobile  │────▶│ Supabase │────▶│   Mux    │────▶│  CDN     │
│   App    │     │   API    │     │ (video)  │     │ Delivery │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                                  │
     │                ▼                                  │
     │          ┌──────────┐                            │
     │          │PostgreSQL│                            │
     │          │ Database │                            │
     │          └──────────┘                            │
     │                │                                  │
     │                ▼                                  │
     │          ┌──────────┐                            │
     └─────────▶│  Stripe  │◀───────────────────────────┘
                │ Payments │
                └──────────┘
```

---

## Environment Configuration

### Development
- Local Expo dev server
- Supabase local or dev project
- Mux test environment
- Stripe test mode

### Staging
- EAS Preview builds
- Supabase staging project
- Mux staging
- Stripe test mode

### Production
- EAS Production builds
- Supabase production
- Mux production
- Stripe live mode

---

## Security

| Layer | Implementation |
|-------|----------------|
| **Authentication** | Supabase Auth + JWT |
| **Authorization** | Row-Level Security (RLS) |
| **API Security** | Supabase API keys + JWT |
| **Data Encryption** | TLS in transit, encrypted at rest |
| **Payment Security** | Stripe handles PCI compliance |
| **Video Security** | Mux signed URLs |

---

## Scalability Considerations

| Component | Scaling Strategy |
|-----------|------------------|
| **Database** | Supabase Pro+ plans, read replicas |
| **Video** | Mux scales automatically |
| **Storage** | Supabase storage scales |
| **API** | Supabase edge, horizontal scaling |
| **App** | No scaling needed (client-side) |

---

*Document Version: 1.0*
*Last Updated: January 2026*
