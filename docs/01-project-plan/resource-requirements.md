# BizVibe - Resource Requirements

## Overview

This document outlines the human, technical, and financial resources required to successfully deliver the BizVibe project from planning through full production.

---

## Team Structure

### MVP Team (Months 1-6)

```
┌─────────────────────────────────────────────────────────────┐
│                    MVP TEAM STRUCTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────────┐                      │
│                    │  Product Owner  │                      │
│                    │  (1 FTE)        │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│         ┌───────────────────┼───────────────────┐           │
│         │                   │                   │           │
│         ▼                   ▼                   ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Full-Stack  │    │ Full-Stack  │    │  Designer   │     │
│  │  Dev #1     │    │  Dev #2     │    │ (0.5 FTE)   │     │
│  │  (1 FTE)    │    │  (1 FTE)    │    └─────────────┘     │
│  └─────────────┘    └─────────────┘                        │
│                                                             │
│  Total: 3.5 FTE                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Growth Team (Months 7-12)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GROWTH TEAM STRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         ┌─────────────────┐                             │
│                         │  Product Owner  │                             │
│                         │  (1 FTE)        │                             │
│                         └────────┬────────┘                             │
│                                  │                                      │
│      ┌────────────┬──────────────┼──────────────┬────────────┐          │
│      │            │              │              │            │          │
│      ▼            ▼              ▼              ▼            ▼          │
│ ┌─────────┐ ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │
│ │ Mobile  │ │ Mobile  │   │ Backend │   │ Designer│   │   QA    │      │
│ │ Dev #1  │ │ Dev #2  │   │   Dev   │   │ (1 FTE) │   │ (1 FTE) │      │
│ │ (1 FTE) │ │ (1 FTE) │   │ (1 FTE) │   └─────────┘   └─────────┘      │
│ └─────────┘ └─────────┘   └─────────┘                                  │
│                                                                         │
│                    ┌─────────────────────────┐                          │
│                    │  Support Roles          │                          │
│                    ├─────────────────────────┤                          │
│                    │  • DevOps (0.5 FTE)     │                          │
│                    │  • Marketing (1 FTE)    │                          │
│                    │  • Biz Dev (1 FTE)      │                          │
│                    └─────────────────────────┘                          │
│                                                                         │
│  Total: 8.5 FTE                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Role Specifications

### Product Owner

| Attribute | Specification |
|-----------|---------------|
| **Allocation** | 1 FTE |
| **Experience** | 3+ years product management |
| **Skills** | Agile, mobile apps, marketplace products |
| **Responsibilities** | Backlog management, stakeholder communication, feature prioritization |

**Key Qualifications**:
- Experience with two-sided marketplace products
- Strong UX sensibility
- Data-driven decision making
- Excellent communication skills

### Full-Stack Developer (Mobile Focus)

| Attribute | Specification |
|-----------|---------------|
| **Allocation** | 1-2 FTE (based on phase) |
| **Experience** | 3+ years React Native/Expo |
| **Skills** | TypeScript, React Native, Supabase, REST APIs |
| **Responsibilities** | Mobile app development, API integration, testing |

**Key Qualifications**:
- Strong React Native experience (Expo preferred)
- Experience with video streaming/playback
- Understanding of mobile performance optimization
- Familiarity with app store submission process

### Full-Stack Developer (Backend Focus)

| Attribute | Specification |
|-----------|---------------|
| **Allocation** | 1 FTE |
| **Experience** | 3+ years backend development |
| **Skills** | PostgreSQL, Supabase, Node.js/Deno, REST APIs |
| **Responsibilities** | Database design, API development, integrations |

**Key Qualifications**:
- Strong PostgreSQL experience
- Supabase or similar BaaS experience
- Understanding of payment systems (Stripe)
- Video processing knowledge a plus

### UI/UX Designer

| Attribute | Specification |
|-----------|---------------|
| **Allocation** | 0.5-1 FTE (based on phase) |
| **Experience** | 2+ years mobile app design |
| **Skills** | Figma, mobile design patterns, design systems |
| **Responsibilities** | UI design, user research, prototyping |

**Key Qualifications**:
- Mobile-first design experience
- Strong portfolio of consumer apps
- Understanding of video/media interfaces
- Experience with design systems

### QA Engineer (Phase 2+)

| Attribute | Specification |
|-----------|---------------|
| **Allocation** | 1 FTE |
| **Experience** | 2+ years mobile QA |
| **Skills** | Manual testing, test automation, mobile devices |
| **Responsibilities** | Test planning, execution, bug tracking |

**Key Qualifications**:
- Mobile app testing experience
- Test automation skills (Detox, Maestro)
- Understanding of CI/CD integration
- Cross-platform testing (iOS/Android)

### DevOps Engineer (Phase 2+)

| Attribute | Specification |
|-----------|---------------|
| **Allocation** | 0.5 FTE |
| **Experience** | 2+ years DevOps |
| **Skills** | CI/CD, monitoring, Supabase, AWS |
| **Responsibilities** | Infrastructure, deployment, monitoring |

**Key Qualifications**:
- GitHub Actions experience
- Supabase administration
- Monitoring and alerting setup
- Cost optimization experience

---

## Technology Resources

### Development Tools

| Tool | Purpose | Cost |
|------|---------|------|
| GitHub (Team) | Code repository, CI/CD | $4/user/month |
| Figma (Professional) | Design collaboration | $15/user/month |
| Linear | Project management | $8/user/month |
| Slack (Pro) | Team communication | $8.75/user/month |
| Notion | Documentation | $10/user/month |

**Monthly Tool Cost (5 users)**: ~$230/month

### Cloud Infrastructure

| Service | Purpose | Estimated Monthly Cost |
|---------|---------|------------------------|
| **Supabase Pro** | Backend, DB, Auth, Storage | $25 - $500 |
| **Mux** | Video processing & CDN | $500 - $5,000 |
| **Vercel Pro** | Web dashboard hosting | $20 - $100 |
| **Sentry** | Error tracking | $26 - $80 |
| **Amplitude** | Product analytics | Free - $500 |

**Monthly Infrastructure (MVP)**: ~$600 - $1,500
**Monthly Infrastructure (Scale)**: ~$2,000 - $10,000+

### Third-Party Services

| Service | Purpose | Cost Model |
|---------|---------|------------|
| **Stripe** | Payments | 2.9% + $0.30/transaction |
| **Expo EAS** | App builds, OTA updates | $99/month |
| **Apple Developer** | iOS distribution | $99/year |
| **Google Play** | Android distribution | $25 one-time |
| **Algolia** | Search (Phase 2) | Free - $500/month |

---

## Budget Breakdown

### Phase 1-3: MVP (Months 1-6)

| Category | Monthly | 6-Month Total |
|----------|---------|---------------|
| **Personnel** | | |
| Full-Stack Dev #1 | $10,000 | $60,000 |
| Full-Stack Dev #2 | $10,000 | $60,000 |
| Designer (0.5 FTE) | $4,000 | $24,000 |
| Product Owner | $9,000 | $54,000 |
| **Subtotal Personnel** | $33,000 | **$198,000** |
| | | |
| **Tools & Services** | | |
| Development Tools | $250 | $1,500 |
| Supabase | $100 | $600 |
| Mux | $500 | $3,000 |
| Expo EAS | $99 | $594 |
| Other Services | $200 | $1,200 |
| **Subtotal Tools** | $1,149 | **$6,894** |
| | | |
| **Other** | | |
| Legal & Compliance | - | $10,000 |
| Design Assets | - | $2,000 |
| Contingency (10%) | - | $21,700 |
| **Subtotal Other** | - | **$33,700** |
| | | |
| **TOTAL MVP** | | **$238,594** |

### Phase 4-5: Growth & Scale (Months 7-12)

| Category | Monthly | 6-Month Total |
|----------|---------|---------------|
| **Personnel** | | |
| Mobile Devs (2) | $20,000 | $120,000 |
| Backend Dev | $10,000 | $60,000 |
| Designer | $8,000 | $48,000 |
| QA Engineer | $7,000 | $42,000 |
| DevOps (0.5) | $4,000 | $24,000 |
| Product Owner | $9,000 | $54,000 |
| Marketing | $8,000 | $48,000 |
| Biz Dev | $8,000 | $48,000 |
| **Subtotal Personnel** | $74,000 | **$444,000** |
| | | |
| **Infrastructure** | | |
| Supabase (scale) | $500 | $3,000 |
| Mux (scale) | $3,000 | $18,000 |
| Vercel | $100 | $600 |
| Other Services | $500 | $3,000 |
| **Subtotal Infrastructure** | $4,100 | **$24,600** |
| | | |
| **Marketing** | | |
| Paid Acquisition | $10,000 | $60,000 |
| Content & PR | $2,000 | $12,000 |
| **Subtotal Marketing** | $12,000 | **$72,000** |
| | | |
| **Contingency (10%)** | - | **$54,060** |
| | | |
| **TOTAL GROWTH** | | **$594,660** |

### Total Year 1 Budget

| Phase | Duration | Budget |
|-------|----------|--------|
| MVP (Phases 1-3) | Months 1-6 | $238,594 |
| Growth (Phases 4-5) | Months 7-12 | $594,660 |
| **TOTAL YEAR 1** | 12 months | **$833,254** |

---

## Resource Allocation by Phase

### Phase 1: Foundation (Weeks 1-8)

| Resource | Allocation | Focus |
|----------|------------|-------|
| Full-Stack Dev #1 | 100% | Infrastructure, auth |
| Full-Stack Dev #2 | 100% | Database, API setup |
| Designer | 50% | Design system, auth flows |
| Product Owner | 100% | Requirements, planning |

### Phase 2: Core Features (Weeks 9-16)

| Resource | Allocation | Focus |
|----------|------------|-------|
| Full-Stack Dev #1 | 100% | Video player, feed UI |
| Full-Stack Dev #2 | 100% | Mux integration, API |
| Designer | 75% | Feed design, business profiles |
| Product Owner | 100% | Feature prioritization |

### Phase 3: MVP Launch (Weeks 17-24)

| Resource | Allocation | Focus |
|----------|------------|-------|
| Full-Stack Dev #1 | 100% | Messaging, checkout |
| Full-Stack Dev #2 | 100% | Payments, notifications |
| Designer | 50% | Polish, refinements |
| Product Owner | 100% | Launch coordination |

### Phase 4-5: Growth & Scale (Weeks 25-48)

| Resource | Allocation | Focus |
|----------|------------|-------|
| Mobile Devs (2) | 100% | New features, optimization |
| Backend Dev | 100% | Web dashboard, scale |
| Designer | 100% | Web design, new features |
| QA Engineer | 100% | Testing, automation |
| DevOps | 50% | Infrastructure, monitoring |
| Product Owner | 100% | Product strategy |
| Marketing | 100% | Growth campaigns |
| Biz Dev | 100% | Business acquisition |

---

## Hiring Timeline

```
Month 1-2: Core Team (MVP)
├── Full-Stack Dev #1 (hired)
├── Full-Stack Dev #2 (hired)
├── Designer - 0.5 FTE (hired)
└── Product Owner (hired)

Month 5-6: Pre-Growth Hiring
├── QA Engineer (hire)
└── Marketing (hire)

Month 7-8: Growth Team
├── Mobile Dev #2 (hire)
├── Designer upgrade to 1 FTE
├── DevOps - 0.5 FTE (hire)
└── Biz Dev (hire)
```

---

## Contractor vs. Employee

### Recommended Employee Roles

| Role | Reason |
|------|--------|
| Full-Stack Developers | Core product development, long-term |
| Product Owner | Strategic continuity |
| Designer (Phase 2+) | Consistent design language |

### Suitable for Contract

| Role | Reason |
|------|--------|
| Designer (MVP) | Part-time need |
| DevOps | Specialized, part-time |
| Legal/Compliance | Periodic need |
| Specialized Development | Specific features |

---

## Skills Matrix

| Skill | Required Level | Training Needed |
|-------|----------------|-----------------|
| React Native | Expert | None |
| TypeScript | Expert | None |
| Expo | Advanced | Minor |
| Supabase | Intermediate | Some |
| PostgreSQL | Advanced | None |
| Mux API | Beginner | Yes |
| Stripe Connect | Intermediate | Some |
| Mobile Performance | Advanced | None |
| Video Streaming | Intermediate | Some |

### Training Plan

| Topic | Method | Duration | Cost |
|-------|--------|----------|------|
| Supabase Deep Dive | Online course | 8 hours | Free |
| Mux Integration | Documentation + POC | 16 hours | Free |
| Stripe Connect | Documentation + POC | 8 hours | Free |
| Mobile Video Performance | Research + Testing | 16 hours | Free |

---

## Resource Risks

### Risk: Key Skill Gaps

**Mitigation**: 
- Identify gaps early in hiring
- Budget for training time
- Consider specialist contractors for complex features

### Risk: Hiring Delays

**Mitigation**:
- Start recruiting 4-6 weeks before need
- Have contractor backups identified
- Consider remote hiring for larger talent pool

### Risk: Attrition

**Mitigation**:
- Competitive compensation
- Equity participation
- Good work environment
- Cross-training for bus factor

---

## Summary

| Phase | Team Size | Monthly Burn | Total Budget |
|-------|-----------|--------------|--------------|
| MVP (1-6) | 3.5 FTE | ~$34,000 | $238,594 |
| Growth (7-12) | 8.5 FTE | ~$90,000 | $594,660 |
| **Year 1** | Variable | Variable | **$833,254** |

---

*Document Version: 1.0*
*Last Updated: January 2026*
