# BizVibe - Active Context

## Current Focus

**Phase**: Core Features - Data Integration
**Status**: Video playback complete, ready for Supabase data fetching
**Date**: January 17, 2026

---

## What We've Completed

### Project Setup ✅
- Created Expo Router project using official template (`npx create-expo-app@latest --template tabs`)
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

### Authentication System ✅ (Tested & Working)
- Sign Up works (creates user + profile)
- Sign In works
- Sign Out works
- Profile displays user info when logged in
- Email confirmation disabled for dev

### Video Playback ✅ (Just Completed)
- **expo-av installed** - Video player package for React Native
- **VideoPlayer component** (`components/VideoPlayer.tsx`)
  - Full-screen vertical video playback
  - Play/pause on tap with visual feedback
  - Mute toggle button (top right)
  - Loading indicator with BizVibe coral spinner
  - Auto-play when video enters view
  - Auto-pause and reset when scrolling away
  - Looping video playback
- **Feed Screen Updated** (`app/(tabs)/index.tsx`)
  - FlatList with pagingEnabled for TikTok-style snap scrolling
  - viewabilityConfig to detect which video is active (50% threshold)
  - Performance optimizations: removeClippedSubviews, windowSize=3, maxToRenderPerBatch=2
  - 5 sample videos from Google's video bucket for testing
- **Video Overlay UI**
  - Header with BizVibe logo and For You/Following tabs
  - Business info: avatar, name, handle, distance, caption
  - Action bar: like count, comment count, save, share
  - Follow badge (+) on business avatar
  - Text shadows for readability over video
- **Dark Tab Bar** - Feed screen has dark themed navigation bar

---

## What's Next

### Immediate Priority: Supabase Data Integration
1. **Fetch videos from Supabase** - Replace sample data with real database
2. **Add seed videos to database** - Upload test videos to Supabase Storage
3. **Implement infinite scroll** - Pagination with cursor-based loading

### Near-term Tasks
- Business profile pages (tap on business to view)
- Video upload functionality (Create screen)
- Like/Save interactions (connect to database)
- Category filtering on Discover

---

## Recent Decisions

### January 17, 2026

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Video Player | expo-av | Official Expo package, well-supported |
| Feed Scroll | FlatList + pagingEnabled | Native performance, snap-to-screen behavior |
| Sample Videos | Google sample bucket | Free, reliable, various durations |
| Active Video Detection | viewabilityConfig 50% | Standard threshold for auto-play |

### Previous Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Expo Go Mode | Tunnel (`--tunnel`) | Local network/firewall blocks LAN mode |
| Email Confirmation | Disabled | Faster testing during development |
| Backend | Supabase | PostgreSQL, Auth, Realtime, Storage all-in-one |
| Auth Pattern | Context + useAuth hook | Clean, React-native-friendly state management |
| Icon Library | Lucide React Native | Clean, professional, tree-shakeable |

---

## Technical Notes

### Current File Structure
```
app/
├── _layout.tsx           # Root layout with AuthProvider
├── (auth)/
│   ├── _layout.tsx       # Auth stack navigator
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
├── VideoPlayer.tsx       # Full-screen video player component (NEW)
constants/
├── Colors.ts             # BizVibe color palette + themes
contexts/
├── AuthContext.tsx       # Authentication state management
lib/
├── supabase.ts           # Supabase client (lazy initialization)
```

### Key Commands
```bash
# Start development (MUST use --tunnel for Expo Go)
npx expo start --tunnel

# Clear cache if issues
npx expo start --tunnel --clear
```

### Video Feed Data Structure
```typescript
interface VideoItem {
  id: string;
  uri: string;
  business: {
    name: string;
    handle: string;
    avatar: string;
    distance: string;
  };
  caption: string;
  stats: {
    likes: number;
    comments: number;
  };
}
```

### Database Tables (Active)
- `profiles` - User profiles (auto-created on signup)
- `businesses` - Business accounts
- `videos` - Video content (needs real data)
- `categories` - Content categories (seeded)
- Others ready for future features

---

## Active Blockers

None - ready to proceed with Supabase data integration.

---

## Learnings & Insights

1. **Tunnel Mode Required**: Local network/firewall blocks Expo Go LAN mode - always use `--tunnel`
2. **User vs Profile**: Supabase stores auth users in `auth.users` table, profiles is separate
3. **Email Confirmation**: Disabled for dev, enable for production
4. **Lazy Supabase Init**: Prevents SSR issues in web builds
5. **Route Type Casting**: Use `as any` for Expo Router strict typing workaround
6. **Video Feed Performance**: Use windowSize, removeClippedSubviews, getItemLayout for smooth scrolling
7. **viewabilityConfig**: Set itemVisiblePercentThreshold to control auto-play trigger

---

*Last Updated: January 17, 2026*
*Session: Video Playback Complete, Ready for Data Integration*
