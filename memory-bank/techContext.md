# BizVibe - Technical Context

## Current Technology Stack

### Mobile Application (Implemented)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| **Expo** | SDK 54 | React Native framework | ✅ Configured |
| **React Native** | Latest | Cross-platform mobile UI | ✅ Working |
| **TypeScript** | 5.0+ | Type-safe JavaScript | ✅ Configured |
| **Expo Router** | 4.0+ | File-based navigation | ✅ Working |
| **lucide-react-native** | Latest | Icon library | ✅ Installed |
| **react-native-svg** | Latest | SVG support | ✅ Installed |
| **react-native-safe-area-context** | Latest | Safe area handling | ✅ Working |

### Planned (Not Yet Implemented)

| Technology | Purpose | Phase |
|------------|---------|-------|
| **Supabase** | Backend, Auth, Database | Phase 1 |
| **expo-av** | Video playback | Phase 2 |
| **TanStack Query** | Server state | Phase 2 |
| **Zustand** | Client state | Phase 2 |
| **Mux** | Video processing | Phase 3 |
| **Stripe Connect** | Payments | Phase 4 |

---

## Development Environment

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Expo Go app on iOS/Android
```

### Environment Variables

```bash
# .env (to be created)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### Commands

```bash
# Start development server
npx expo start

# Clear cache and start
npx expo start --clear

# Install Expo-compatible packages
npx expo install [package-name]
```

---

## Current Project Structure

```
BizVibe/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (Stack navigator)
│   ├── +html.tsx                 # Web HTML template
│   ├── +not-found.tsx            # 404 page
│   ├── modal.tsx                 # Modal screen
│   └── (tabs)/                   # Tab navigator
│       ├── _layout.tsx           # Tab configuration + Lucide icons
│       ├── index.tsx             # Feed screen (TikTok-style)
│       ├── discover.tsx          # Search + categories
│       ├── create.tsx            # Video creation
│       ├── inbox.tsx             # Messages
│       └── profile.tsx           # User profile
│
├── components/                   # Reusable components (from template)
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   ├── Themed.tsx
│   ├── useClientOnlyValue.ts
│   └── useColorScheme.ts
│
├── constants/                    # App constants
│   ├── Colors.ts                 # BizVibe color palette + themes
│   ├── index.ts
│   ├── spacing.ts
│   └── typography.ts
│
├── lib/                          # Library configurations
│   └── supabase.ts               # Supabase client (to be configured)
│
├── types/                        # TypeScript types
│   └── supabase.ts               # Database types
│
├── docs/                         # Project documentation
│   ├── 01-project-plan/
│   ├── 02-market-validation/
│   ├── 03-product-design/
│   ├── 04-technical-architecture/
│   └── 05-code-structure/
│
├── memory-bank/                  # Project memory
│   ├── activeContext.md
│   ├── productContext.md
│   ├── progress.md
│   ├── projectbrief.md
│   ├── systemPatterns.md
│   └── techContext.md
│
├── assets/                       # Static assets
│   ├── fonts/
│   └── images/
│
├── .clinerules/                  # Cline rules
│   └── expo-router-setup.md      # Expo setup guidelines
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── babel.config.js               # Babel config (presets only)
```

---

## Current Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.x",
    "react-native-safe-area-context": "^4.x",
    "react-native-screens": "^4.x",
    "lucide-react-native": "^0.x",
    "react-native-svg": "^15.x"
  }
}
```

---

## Configuration Files

### app.json

```json
{
  "expo": {
    "name": "BizVibe",
    "slug": "bizvibe",
    "scheme": "bizvibe",
    "ios": {
      "bundleIdentifier": "com.bizvibe.app"
    },
    "android": {
      "package": "com.bizvibe.app"
    },
    "plugins": ["expo-router"]
  }
}
```

### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Note: expo-router/babel plugin NOT needed in SDK 54+
  };
};
```

### tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Code Patterns in Use

### Theme Usage

```typescript
import Colors, { colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function MyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}
```

### Lucide Icons

```typescript
import { Home, Search, PlusCircle } from 'lucide-react-native';

<Home size={24} color={theme.text} />
<Search size={24} color={colors.primary[500]} />
```

### SafeAreaView Pattern

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
  {/* Screen content */}
</SafeAreaView>
```

---

## Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank screen on load | Remove `expo-router/babel` from babel.config.js |
| Colors.ts not found | Ensure capital C (case-sensitive imports) |
| Metro cache stale | Run `npx expo start --clear` |

---

## Performance Considerations

### Current Optimizations
- Lucide icons are tree-shakeable (only imports used icons)
- Theme colors computed once per render

### Future Optimizations Needed
- FlashList for video feed
- Video preloading strategy
- Image caching with expo-image

---

*Last Updated: January 16, 2026*
*Version: 1.1 (Post UI Implementation)*
