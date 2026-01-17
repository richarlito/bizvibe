# BizVibe - System Patterns

## Architecture Overview

BizVibe follows a **mobile-first, serverless-centric architecture** leveraging Supabase as the backend-as-a-service platform, with specialized services for video processing and payments.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────┐   ┌─────────────────────────────┐ │
│   │    EXPO + REACT NATIVE      │   │     NEXT.JS (Phase 2)       │ │
│   │    ├── Consumer App         │   │     ├── Business Dashboard  │ │
│   │    └── Business App         │   │     └── Admin Panel         │ │
│   │    (iOS + Android)          │   │     (Web - Vercel)          │ │
│   └─────────────────────────────┘   └─────────────────────────────┘ │
│                                                                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                      SUPABASE                               │   │
│   │   ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │   │
│   │   │  REST API   │ │  Realtime   │ │   Edge Functions    │   │   │
│   │   │  (Auto-gen) │ │  (WebSocket)│ │   (Deno Runtime)    │   │   │
│   │   └─────────────┘ └─────────────┘ └─────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│   │   PostgreSQL   │  │    Storage     │  │     Redis      │        │
│   │   (Primary DB) │  │   (S3-compat)  │  │   (Caching)    │        │
│   └────────────────┘  └────────────────┘  └────────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────────┐   │
│   │   MUX    │  │    STRIPE    │  │   EXPO   │  │   ALGOLIA    │   │
│   │  Video   │  │   Connect    │  │   Push   │  │   Search     │   │
│   └──────────┘  └──────────────┘  └──────────┘  └──────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Decisions

### 1. Expo + React Native for Mobile

**Decision**: Use Expo managed workflow for cross-platform mobile development.

**Rationale**:
- Single codebase for iOS and Android
- OTA updates without app store review
- Excellent video handling with expo-av
- Simplified build and deployment
- Large ecosystem of compatible libraries

**Trade-offs**:
- Some native modules require ejecting (mitigated with Expo's config plugins)
- Slightly larger app size
- Dependency on Expo's update cycle

### 2. Supabase as Backend

**Decision**: Use Supabase for authentication, database, realtime, and storage.

**Rationale**:
- PostgreSQL gives us relational power with JSON flexibility
- Built-in auth with social providers
- Realtime subscriptions for messaging and notifications
- Row Level Security for data protection
- Edge Functions for serverless compute
- Significantly faster development time

**Trade-offs**:
- Platform dependency (mitigated: Supabase is open-source, can self-host)
- Less flexibility than custom backend
- Cost scaling considerations at high volume

### 3. Mux for Video Processing

**Decision**: Use Mux for video upload, processing, and delivery.

**Rationale**:
- Purpose-built for video at scale
- Handles transcoding, adaptive bitrate, and CDN
- Simple API integration
- Built-in analytics
- Proven at TikTok-like scale

**Trade-offs**:
- Cost per minute processed/delivered
- Third-party dependency
- Less control over encoding parameters

### 4. Stripe Connect for Payments

**Decision**: Use Stripe Connect in Express mode for marketplace payments.

**Rationale**:
- Industry-leading payment infrastructure
- Handles compliance and payouts
- Express onboarding reduces friction
- Supports platform fees
- Global payment methods

**Trade-offs**:
- Transaction fees (2.9% + $0.30)
- Dependent on Stripe's terms
- Complex for some international markets

---

## Design Patterns

### Pattern 1: Feature-First Architecture (Mobile)

```
src/
├── features/
│   ├── feed/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── auth/
│   ├── profile/
│   ├── messaging/
│   ├── checkout/
│   └── business/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── navigation/
```

**Benefits**:
- Co-located feature code
- Clear boundaries
- Easy to navigate
- Scalable structure

### Pattern 2: Repository Pattern (Data Access)

```typescript
// Abstract data access behind repositories
interface VideoRepository {
  getById(id: string): Promise<Video>;
  getFeed(userId: string, cursor: string): Promise<Video[]>;
  create(video: CreateVideoInput): Promise<Video>;
  update(id: string, data: UpdateVideoInput): Promise<Video>;
  delete(id: string): Promise<void>;
}

// Implementation uses Supabase
class SupabaseVideoRepository implements VideoRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async getFeed(userId: string, cursor: string): Promise<Video[]> {
    const { data, error } = await this.supabase
      .from('videos')
      .select('*, business:businesses(*)')
      .order('score', { ascending: false })
      .limit(20);
    // ...
  }
}
```

**Benefits**:
- Decouples business logic from data source
- Easy to mock for testing
- Can swap implementations

### Pattern 3: Optimistic Updates (UI)

```typescript
// Update UI immediately, reconcile with server
const useLikeVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (videoId: string) => likeVideo(videoId),
    onMutate: async (videoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['video', videoId]);
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['video', videoId]);
      
      // Optimistically update
      queryClient.setQueryData(['video', videoId], (old) => ({
        ...old,
        isLiked: true,
        likeCount: old.likeCount + 1,
      }));
      
      return { previous };
    },
    onError: (err, videoId, context) => {
      // Rollback on error
      queryClient.setQueryData(['video', videoId], context.previous);
    },
  });
};
```

**Benefits**:
- Instant feedback for users
- Handles offline scenarios
- Reduces perceived latency

### Pattern 4: Event-Driven Architecture (Backend)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Supabase   │────▶│   Webhook   │
│   Action    │     │   Insert    │     │   Trigger   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
             │  Process    │           │   Send      │           │   Update    │
             │  Video      │           │   Notif     │           │   Analytics │
             └─────────────┘           └─────────────┘           └─────────────┘
```

**Benefits**:
- Decoupled services
- Async processing
- Scalable
- Easy to add new handlers

---

## Component Relationships

### Authentication Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│  User   │────▶│   Supabase  │────▶│   Session   │
│  Login  │     │    Auth     │     │   Created   │
└─────────┘     └──────┬──────┘     └──────┬──────┘
                       │                   │
                       ▼                   ▼
                ┌─────────────┐     ┌─────────────┐
                │   Profile   │     │   JWT in    │
                │   Created   │     │   Storage   │
                └─────────────┘     └─────────────┘
```

### Video Upload Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Record/   │────▶│   Upload    │────▶│    MUX      │
│   Select    │     │   to MUX    │     │  Processing │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────┴──────┐
                                        │   Webhook   │
                                        │   Ready     │
                                        └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
             ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
             │   Update    │           │   Notify    │           │   Index     │
             │   Status    │           │   Business  │           │   for Feed  │
             └─────────────┘           └─────────────┘           └─────────────┘
```

### Feed Algorithm Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Build     │────▶│   Score     │
│   Request   │     │   Context   │     │   Videos    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    │                                                     │
                    ▼                                                     ▼
             ┌─────────────────┐                               ┌─────────────────┐
             │   Location      │                               │   Engagement    │
             │   Score         │                               │   Score         │
             └────────┬────────┘                               └────────┬────────┘
                      │                                                 │
                      └────────────────┬────────────────────────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │   Ranked    │
                                │   Feed      │
                                └─────────────┘
```

### Payment Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Create    │────▶│   Stripe    │
│   Checkout  │     │   Intent    │     │   Process   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────┴──────┐
                                        │   Webhook   │
                                        │   Success   │
                                        └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
             ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
             │   Create    │           │   Split     │           │   Notify    │
             │   Order     │           │   Payment   │           │   Parties   │
             └─────────────┘           └─────────────┘           └─────────────┘
```

---

## Critical Implementation Paths

### Path 1: Video Feed Performance

**Challenge**: Smooth infinite scroll with video autoplay

**Solution**:
- Use FlashList for virtualized list
- Implement video preloading (next 2 videos)
- Unload videos outside viewport
- Cache video thumbnails
- Use adaptive bitrate streaming

```typescript
// Feed video management
const FeedVideo = ({ video, isVisible }) => {
  const videoRef = useRef();
  
  useEffect(() => {
    if (isVisible) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isVisible]);
  
  return (
    <Video
      ref={videoRef}
      source={{ uri: video.playbackUrl }}
      resizeMode="cover"
      shouldPlay={isVisible}
      isLooping
    />
  );
};
```

### Path 2: Realtime Messaging

**Challenge**: Instant message delivery with offline support

**Solution**:
- Supabase Realtime for live updates
- Local message queue for offline
- Optimistic UI updates
- Message read receipts

```typescript
// Realtime subscription
const useMessages = (conversationId: string) => {
  useEffect(() => {
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        // Add new message to state
      })
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, [conversationId]);
};
```

### Path 3: Location-Based Discovery

**Challenge**: Fast, accurate geo-queries

**Solution**:
- PostGIS extension in PostgreSQL
- Geohash indexing
- Tiered radius expansion
- Location caching on client

```sql
-- Geo-query example
SELECT *, 
  ST_Distance(location, ST_MakePoint($lng, $lat)::geography) as distance
FROM businesses
WHERE ST_DWithin(location, ST_MakePoint($lng, $lat)::geography, $radius)
ORDER BY distance
LIMIT 20;
```

---

## Security Patterns

### Row Level Security (RLS)

```sql
-- Users can only read their own data
CREATE POLICY "Users read own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Businesses can update own videos
CREATE POLICY "Business update own videos"
ON videos FOR UPDATE
USING (auth.uid() = (SELECT user_id FROM businesses WHERE id = business_id));

-- Anyone can read public videos
CREATE POLICY "Public video read"
ON videos FOR SELECT
USING (status = 'published');
```

### API Security

```typescript
// Edge function authentication
export async function handler(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Proceed with authenticated user
}
```

---

*Last Updated: January 2026*
*Version: 1.0*
