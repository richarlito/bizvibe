# BizVibe - Project Brief

## Project Overview

**BizVibe** is a mobile-first social commerce platform that combines TikTok-style short-form video discovery with seamless e-commerce transactions. Businesses create engaging 15-60 second video pitches, and users scroll through a personalized feed to discover, connect, and purchase products and services.

## Vision Statement

To revolutionize local commerce by making business discovery as engaging and addictive as social media, while empowering small and medium businesses with powerful, accessible video marketing tools.

## Core Problem Statement

### For Consumers:
- Traditional business discovery (Google, Yelp) is static and boring
- Hard to get a "feel" for a business before visiting
- Local gems are buried under big-brand advertising
- No engaging way to discover new products/services

### For Businesses:
- Video marketing is complex and expensive
- Social media algorithms favor personal content over business content
- Difficult to reach local, relevant customers
- No direct path from discovery to purchase

## Solution

BizVibe creates a dedicated ecosystem where:
1. **Businesses** easily create and share video content that reaches interested local customers
2. **Consumers** discover businesses through an engaging, personalized video feed
3. **Transactions** happen seamlessly within the app
4. **Community** forms around shared interests and local commerce

## Target Users

### Primary: Consumers (18-45)
- Urban/suburban dwellers
- Mobile-first users
- Value authentic, local businesses
- Enjoy video content consumption
- Make purchasing decisions based on social proof

### Primary: Business Owners
- Small to medium local businesses
- Service providers and retailers
- Restaurants, cafes, salons, fitness studios
- E-commerce entrepreneurs
- Side hustlers and creators

## Core Features (MVP)

1. **Infinite Scroll Video Feed**
   - Vertical video format (15-60 seconds)
   - Algorithm-driven personalization
   - Location-based discovery
   - Category filtering

2. **Business Profiles & Video Upload**
   - Easy video creation and upload
   - Business information and product listings
   - Contact and location details

3. **Categories & Discovery**
   - Curated categories (Local Eats, Fashion, Services, etc.)
   - Location filters ("Near Me")
   - Search functionality

4. **Messaging**
   - In-app chat between users and businesses
   - Inquiry and negotiation support

5. **Transactions**
   - Stripe Connect integration
   - In-app checkout
   - Platform fee (2-5%)

6. **User Engagement**
   - Wishlist/favorites
   - Push notifications
   - Basic reviews

## Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Average session duration
- Videos watched per session
- Scroll depth

### Business Success
- Number of active business accounts
- Videos uploaded per business
- Engagement rate (views, saves, messages)
- Conversion rate (view → purchase)

### Platform Health
- Gross Merchandise Value (GMV)
- Take rate realization
- User retention (D1, D7, D30)
- Business retention

## Project Scope

### In Scope (MVP - Phases 1-3)
- iOS and Android mobile apps (Expo/React Native)
- Consumer and business user experiences
- Video feed with basic recommendation algorithm
- Video upload and processing (Mux)
- In-app messaging
- Stripe Connect payments
- Push notifications
- Basic analytics for businesses

### Phase 2 Additions (Months 7-9)
- Business web dashboard (Next.js/Vercel)
- Admin panel
- Advanced analytics
- Community features (duet/react)

### Out of Scope (Future Phases)
- AI-assisted video editing
- Advanced ML recommendation engine
- Advertising/boost platform
- International expansion
- Desktop consumer experience

## Technical Constraints

- Must support iOS 14+ and Android 10+
- Video files limited to 60 seconds, optimized for mobile
- Must handle video processing at scale
- Real-time messaging requirements
- Payment processing compliance (PCI-DSS via Stripe)

## Timeline Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| Foundation | Months 1-2 | Architecture, auth, basic infrastructure |
| Core Features | Months 3-4 | Video system, profiles, feed |
| MVP Launch | Months 5-6 | Payments, messaging, polish, beta |
| Growth | Months 7-9 | Web dashboard, community features |
| Scale | Months 10-12 | Advanced features, optimization |

## Stakeholders

- **Product Owner**: Defines requirements and priorities
- **Development Team**: Builds and maintains the platform
- **Design Team**: Creates user experience and visual design
- **Business Development**: Acquires business users
- **Marketing**: Acquires consumer users
- **Operations**: Manages platform health and support

## Budget Considerations

### Technology Costs (Monthly at Scale)
- Supabase Pro: $25-500+
- Mux Video: Variable (per minute processed/delivered)
- Vercel: $20-100+
- Stripe: 2.9% + $0.30 per transaction
- Push Notifications: Included with Expo
- Domain/SSL: ~$50/year

### Development Costs
- To be determined based on team composition
- Estimated 6-12 months to full production

## Risk Summary

| Risk | Impact | Mitigation |
|------|--------|------------|
| Video processing costs | High | Optimize encoding, implement limits |
| User acquisition | High | Focus on local markets, viral mechanics |
| Business adoption | High | Easy onboarding, demonstrate ROI |
| Competition | Medium | Differentiate on local focus |
| Technical scalability | Medium | Cloud-native architecture |

---

*Last Updated: January 2026*
*Version: 1.0*
