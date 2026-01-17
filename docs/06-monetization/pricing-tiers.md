# BizVibe - Business Subscription Tiers

## Overview

BizVibe operates on a freemium model with tiered subscriptions for businesses. The model is designed to:
- Lower barrier to entry (free tier)
- Scale with business growth
- Monetize video upload capacity (core value)
- Incentivize upgrades through feature differentiation

---

## Subscription Tiers

### 🆓 Free Tier
**Price:** $0/month

| Feature | Limit |
|---------|-------|
| Videos per month | 3 |
| Video length | 15 seconds max |
| Video retention | 30 days (auto-archive) |
| Profile | Basic (logo, name, description) |
| Analytics | View count only |
| Reach | Standard algorithm |
| Messaging | Receive only |
| Support | Community/FAQ |

**Ideal for:** Businesses testing the platform or with minimal marketing needs.

---

### 🚀 Starter Tier
**Price:** $19/month (or $190/year - save 17%)

| Feature | Limit |
|---------|-------|
| Videos per month | 10 |
| Video length | 60 seconds max |
| Video retention | 90 days |
| Profile | Enhanced (photos, hours, links) |
| Analytics | Views, engagement, demographics |
| Reach | Priority in category |
| Messaging | Send & receive |
| Support | Email support |

**Bonus Features:**
- 1 free video boost per month ($10 value)
- Category tag highlighting
- Business hours display

**Ideal for:** Small businesses actively marketing locally.

---

### ⭐ Pro Tier
**Price:** $49/month (or $490/year - save 17%)

| Feature | Limit |
|---------|-------|
| Videos per month | 30 |
| Video length | 3 minutes max |
| Video retention | 1 year |
| Profile | Premium (portfolio, menu, services) |
| Analytics | Full suite + conversion tracking |
| Reach | Boosted algorithm weight |
| Messaging | Unlimited + quick replies |
| Support | Priority email + chat |

**Bonus Features:**
- 3 free video boosts per month ($30 value)
- "Pro Business" badge
- Competitor insights
- Scheduled posting
- Custom call-to-action buttons

**Ideal for:** Growing businesses with regular content strategy.

---

### 🏢 Enterprise Tier
**Price:** $149/month (or $1,490/year - save 17%)

| Feature | Limit |
|---------|-------|
| Videos per month | Unlimited |
| Video length | 10 minutes max |
| Video retention | Unlimited |
| Profile | Multi-location support |
| Analytics | API access + custom reports |
| Reach | Maximum algorithm priority |
| Messaging | Team inbox + CRM integration |
| Support | Dedicated account manager |

**Bonus Features:**
- 10 free video boosts per month ($100 value)
- "Featured Business" badge
- White-label embed options
- API access for automation
- Bulk upload tools
- Multi-user team access (5 seats)
- Custom onboarding session

**Ideal for:** Franchises, agencies, multi-location businesses.

---

## À La Carte Add-Ons

Available for all paid tiers:

| Add-On | Price | Description |
|--------|-------|-------------|
| Extra Video Pack | $5 | 5 additional videos for the month |
| Premium Video Slot | $10/video | Extended reach for 1 week |
| Featured Placement | $25/week | Top of category for 1 week |
| Verified Badge | $50 one-time | Trust verification badge |
| Extended Retention | $2/video/month | Keep videos live beyond tier limit |

---

## Video Boost Pricing

Boost any video to increase reach:

| Package | Price | Estimated Additional Views |
|---------|-------|---------------------------|
| Micro Boost | $5 | 500-1,000 views |
| Standard Boost | $10 | 1,000-2,500 views |
| Power Boost | $25 | 3,000-7,500 views |
| Mega Boost | $50 | 8,000-15,000 views |
| Custom | Contact | 15,000+ views |

*Note: View estimates based on market averages. Actual results vary by content quality and targeting.*

---

## Feature Comparison Matrix

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Videos/Month | 3 | 10 | 30 | Unlimited |
| Max Length | 15s | 60s | 3min | 10min |
| Retention | 30d | 90d | 1yr | Unlimited |
| Analytics | Basic | Standard | Advanced | Full + API |
| Messaging | Receive | Full | + Quick Reply | + Team |
| Boosts Included | 0 | 1 | 3 | 10 |
| Support | FAQ | Email | Priority | Dedicated |
| Badge | - | - | Pro | Featured |
| Multi-location | ❌ | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |

---

## Billing & Payment

### Payment Methods
- Credit/debit cards (Visa, Mastercard, Amex)
- Apple Pay / Google Pay (mobile)
- ACH/Bank transfer (Enterprise only)

### Billing Cycles
- Monthly: Billed on signup date each month
- Annual: Billed upfront, 17% discount

### Cancellation Policy
- Cancel anytime, access continues until period ends
- No refunds for partial periods
- Downgrade takes effect next billing cycle
- Videos beyond new tier limit are archived (not deleted)

### Failed Payment
- 3-day grace period
- Account reverts to Free tier after 7 days
- Videos exceeding Free limit archived
- Restore full access upon payment

---

## Implementation Notes

### Database Schema Requirements

```sql
-- Add to businesses table
subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise'
subscription_start_date: timestamp
subscription_end_date: timestamp (for annual)
stripe_customer_id: text
stripe_subscription_id: text
videos_this_month: integer (reset monthly)
video_limit: integer (based on tier)

-- New table: video_boosts
id, video_id, boost_type, start_date, end_date, spend_amount
```

### Stripe Products to Create
- `bizvibe_starter_monthly`
- `bizvibe_starter_annual`
- `bizvibe_pro_monthly`
- `bizvibe_pro_annual`
- `bizvibe_enterprise_monthly`
- `bizvibe_enterprise_annual`
- `bizvibe_video_pack_5`
- `bizvibe_boost_*`

---

*Document Version: 1.0*
*Last Updated: January 2026*
