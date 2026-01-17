# BizVibe - Active Context

## Current Focus

**Phase**: Core Features - Supabase Video Integration
**Status**: Video playback fixed, monetization documented, ready for data integration
**Date**: January 17, 2026

---

## What We've Completed

### Project Setup ✅
- Created Expo Router project using official template
- Fixed configuration issues (Colors.ts case sensitivity, babel config)
- 5-tab navigation structure working

### Design System Implementation ✅
- **Colors**: Full BizVibe palette (Primary Coral #FF6B42, Secondary Blue #5C6CFF)
- **Icons**: Lucide React Native (professional vector icons)
- **Typography**: Consistent sizing and weights
- **Dark/Light Mode**: Full theme support

### Screen UI Complete ✅
1. **Feed** - TikTok-style video feed with working video player
2. **Discover** - Search bar + 6 category cards + location
3. **Create** - Video record CTA + upload + AI edit options
4. **Inbox** - Message tabs + conversation list
5. **Profile** - Auth-aware (shows sign-in card or user profile)

### Backend Infrastructure ✅
1. **Supabase Project** - Connected to `bqorxeqbpchkeesuduwk.supabase.co`
2. **Environment Variables** - `.env` configured with Supabase credentials
3. **Database Migration** - Executed in Supabase SQL Editor
4. **Authentication Context** - `contexts/AuthContext.tsx` with session management
5. **Auth Screens** - Sign In / Sign Up screens with BizVibe styling

### Authentication System ✅
- Sign Up works (creates user + profile)
- Sign In works
- Sign Out works
- Profile displays user info when logged in
- Email confirmation disabled for dev

### Video Playback ✅ (Bug Fixes Applied)
- **VideoPlayer component** (`components/VideoPlayer.tsx`)
  - Play/pause on tap with visual feedback
  - Mute button working (moved outside parent Pressable)
  - Loading indicator with BizVibe coral spinner
  - Auto-play when video enters view
  - Auto-pause when scrolling away or switching tabs
  - ResizeMode.CONTAIN for proper aspect ratio
- **Feed Screen** (`app/(tabs)/index.tsx`)
  - Correct height calculation (accounts for tab bar)
  - useFocusEffect for tab focus tracking
  - Fixed overlay positioning

### Monetization Strategy ✅ (New)
- Created `docs/06-monetization/` folder
- **Pricing Tiers**: Free/Starter/Pro/Enterprise with video limits
- **Revenue Strategy**: 5 revenue streams documented
- Database schema requirements noted for implementation

---

## What's Next

### Immediate Priority: Supabase Video Integration
1. **Set up Supabase Storage bucket** - Create "videos" bucket
2. **Create videos service** (`lib/videos.ts`) - Data fetching layer
3. **Seed database with sample videos** - Use existing sample URLs
4. **Update Feed to use Supabase data** - Replace hardcoded SAMPLE_VIDEOS

### Near-term Tasks
- Infinite scroll with pagination
- Video upload functionality (Create screen)
- Business profile pages
- Like/Save interactions (connect to database)

---

## Recent Decisions

### January 17, 2026

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Video Hosting (MVP) | Supabase Storage | Free, integrated, sufficient for testing |
| Video Hosting (Prod) | Mux | Adaptive streaming, CDN, professional |
| Monetization Model | Tiered subscriptions | Video limits drive upgrades |
| Free Tier Limit | 3 videos/month, 15 sec | Low enough to drive upgrades |

### Previous Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Video Player | expo-av | Official Expo package |
| ResizeMode | CONTAIN (dev), COVER (prod) | Sample videos are horizontal |
| Tab Focus | useFocusEffect | Pause video when leaving tab |

---

## Technical Notes

### Current File Structure
```
app/
├── _layout.tsx           # Root layout with AuthProvider
├── (auth)/
│   ├── sign-in.tsx       # Sign in screen
│   └── sign-up.tsx       # Sign up screen
├── (tabs)/
│   ├── _layout.tsx       # Tab navigator (dark bar for Feed)
│   ├── index.tsx         # Feed screen with video player
│   ├── discover.tsx      # Search & categories
│   ├── create.tsx        # Video creation
│   ├── inbox.tsx         # Messages
│   └── profile.tsx       # User profile (auth-aware)
components/
├── VideoPlayer.tsx       # Full-screen video player component
constants/
├── Colors.ts             # BizVibe color palette + themes
contexts/
├── AuthContext.tsx       # Authentication state management
lib/
├── supabase.ts           # Supabase client (lazy initialization)
├── videos.ts             # Video data service (TO CREATE)
docs/
├── 06-monetization/      # NEW: Monetization documentation
│   ├── pricing-tiers.md
│   └── revenue-strategy.md
```

### Key Commands
```bash
# Start development (MUST use --tunnel for Expo Go)
npx expo start --tunnel

# Clear cache if issues
npx expo start --tunnel --clear
```

### Database Tables (Active)
- `profiles` - User profiles (auto-created on signup)
- `businesses` - Business accounts (needs subscription fields)
- `videos` - Video content (needs sample data)
- `categories` - Content categories (seeded)

---

## Active Blockers

None - ready to proceed with Supabase video integration.

---

## Bug Fixes Applied This Session

| Issue | Fix |
|-------|-----|
| Navbar overlapping content | videoHeight = SCREEN_HEIGHT - TAB_BAR_HEIGHT |
| Video pausing on tab return | Added useFocusEffect, isTabFocused state |
| Mute button not working | Moved button outside parent Pressable |
| Video aspect ratio zoomed | Changed to ResizeMode.CONTAIN |

---

## Learnings & Insights

1. **Tunnel Mode Required**: Local network blocks Expo Go LAN mode
2. **Event Bubbling**: Nested Pressables cause tap conflicts - use separate containers
3. **Tab Bar Height**: Hardcoded 85px works, but could use useBottomTabBarHeight hook
4. **useFocusEffect**: From @react-navigation/native, available in Expo Router
5. **ResizeMode.CONTAIN**: Better for non-vertical videos, COVER for production
6. **Video Monetization**: Limiting uploads is key driver for subscription upgrades

---

*Last Updated: January 17, 2026*
*Session: Video Fixes + Monetization Docs Complete, Ready for Supabase Integration*
