# BizVibe - Frontend Code Structure

## Overview

The mobile app is built with Expo (React Native) using a file-based routing system. This document outlines the project structure and key patterns.

---

## Project Structure

```
apps/mobile/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Auth group (login/signup)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   │
│   ├── (tabs)/                   # Main tab navigator
│   │   ├── _layout.tsx           # Tab configuration
│   │   ├── index.tsx             # Feed (Home)
│   │   ├── discover.tsx          # Search/Categories
│   │   ├── create.tsx            # Video creation
│   │   ├── inbox.tsx             # Messages
│   │   └── profile.tsx           # User profile
│   │
│   ├── (business)/               # Business-specific screens
│   │   ├── dashboard.tsx
│   │   ├── analytics.tsx
│   │   ├── products/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── orders/
│   │       ├── index.tsx
│   │       └── [id].tsx
│   │
│   ├── business/                 # Public business screens
│   │   └── [handle].tsx          # Business profile
│   │
│   ├── video/
│   │   └── [id].tsx              # Single video view
│   │
│   ├── product/
│   │   └── [id].tsx              # Product detail
│   │
│   ├── checkout/
│   │   └── index.tsx             # Checkout flow
│   │
│   ├── chat/
│   │   └── [conversationId].tsx  # Chat screen
│   │
│   ├── settings/
│   │   ├── index.tsx
│   │   ├── account.tsx
│   │   ├── notifications.tsx
│   │   └── privacy.tsx
│   │
│   ├── _layout.tsx               # Root layout
│   ├── +not-found.tsx            # 404
│   └── index.tsx                 # Entry point
│
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   │
│   ├── video/                    # Video-related components
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoFeed.tsx
│   │   ├── VideoRecorder.tsx
│   │   ├── VideoTrimmer.tsx
│   │   └── VideoActions.tsx
│   │
│   ├── business/                 # Business components
│   │   ├── BusinessCard.tsx
│   │   ├── BusinessProfile.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductList.tsx
│   │
│   ├── messaging/                # Chat components
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ConversationList.tsx
│   │   └── ConversationItem.tsx
│   │
│   ├── order/                    # Order components
│   │   ├── OrderCard.tsx
│   │   ├── OrderDetail.tsx
│   │   └── CheckoutForm.tsx
│   │
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── SafeView.tsx
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useBusiness.ts
│   ├── useVideos.ts
│   ├── useMessages.ts
│   ├── useOrders.ts
│   ├── useLocation.ts
│   ├── useCamera.ts
│   └── index.ts
│
├── lib/                          # Core libraries
│   ├── supabase.ts               # Supabase client
│   ├── mux.ts                    # Mux integration
│   ├── stripe.ts                 # Stripe integration
│   ├── storage.ts                # Async storage
│   └── analytics.ts              # Analytics tracking
│
├── services/                     # API services
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── business.service.ts
│   ├── video.service.ts
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── message.service.ts
│   └── index.ts
│
├── stores/                       # Zustand stores
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── feedStore.ts
│   ├── cartStore.ts
│   └── index.ts
│
├── types/                        # TypeScript types
│   ├── user.types.ts
│   ├── business.types.ts
│   ├── video.types.ts
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── message.types.ts
│   └── index.ts
│
├── utils/                        # Utility functions
│   ├── format.ts                 # Date, currency formatters
│   ├── validation.ts             # Form validation
│   ├── location.ts               # Geo utilities
│   └── index.ts
│
├── constants/                    # App constants
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── categories.ts
│   └── index.ts
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

## Key Files

### app/_layout.tsx (Root Layout)
```tsx
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/ThemeProvider';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### app/(tabs)/_layout.tsx (Tab Navigator)
```tsx
import { Tabs } from 'expo-router';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Search color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <Plus color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <MessageCircle color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### lib/supabase.ts
```tsx
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### hooks/useAuth.ts
```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### stores/feedStore.ts (Zustand)
```tsx
import { create } from 'zustand';
import { Video } from '@/types';

interface FeedState {
  videos: Video[];
  currentIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  setVideos: (videos: Video[]) => void;
  appendVideos: (videos: Video[]) => void;
  setCurrentIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  videos: [],
  currentIndex: 0,
  isLoading: false,
  hasMore: true,
  setVideos: (videos) => set({ videos }),
  appendVideos: (videos) => set((state) => ({ 
    videos: [...state.videos, ...videos] 
  })),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setLoading: (isLoading) => set({ isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
}));
```

---

## Component Patterns

### Video Player Component
```tsx
// components/video/VideoPlayer.tsx
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  isActive: boolean;
  onViewComplete?: () => void;
}

export function VideoPlayer({ uri, isActive, onViewComplete }: VideoPlayerProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isActive]);

  const handleStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        onViewComplete?.();
        videoRef.current?.replayAsync();
      }
    }
  }, [onViewComplete]);

  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={() => {
        if (isPlaying) {
          videoRef.current?.pauseAsync();
        } else {
          videoRef.current?.playAsync();
        }
      }}
      style={styles.container}
    >
      <ExpoVideo
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        onPlaybackStatusUpdate={handleStatusUpdate}
      />
    </TouchableOpacity>
  );
}
```

---

## Data Fetching with TanStack Query

```tsx
// hooks/useVideos.ts
import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { videoService } from '@/services/video.service';

export function useFeedVideos(categoryId?: string) {
  return useInfiniteQuery({
    queryKey: ['feed', categoryId],
    queryFn: ({ pageParam = 0 }) => 
      videoService.getFeed({ offset: pageParam, categoryId }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.length === 20 ? pages.length * 20 : undefined,
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getById(id),
  });
}

export function useCreateVideo() {
  return useMutation({
    mutationFn: videoService.create,
    onSuccess: () => {
      // Invalidate feed queries
    },
  });
}
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
