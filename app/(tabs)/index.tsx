import { useFocusEffect } from '@react-navigation/native';
import { Bookmark, Heart, MessageCircle, Plus, RefreshCw, Share2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import VideoPlayer from '@/components/VideoPlayer';
import { colors } from '@/constants/Colors';
import { FeedVideo, getVideosForFeed } from '@/lib/videos';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 85;

// Fallback sample videos (used when database is empty)
const FALLBACK_VIDEOS: FeedVideo[] = [
  {
    id: 'fallback-1',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    business: {
      id: '',
      name: 'Coffee Beans Cafe',
      handle: '@coffeebeans',
      avatar: 'CB',
      distance: '0.3mi',
    },
    caption: 'Fresh roasted beans every morning! ☕ Come try our new seasonal blend and get 20% off your first order.',
    stats: { likes: 2400, comments: 148, saves: 0 },
  },
  {
    id: 'fallback-2',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    business: {
      id: '',
      name: 'Urban Fitness Studio',
      handle: '@urbanfitness',
      avatar: 'UF',
      distance: '0.8mi',
    },
    caption: 'Transform your body in 30 days! 💪 New member special: First month FREE with annual membership.',
    stats: { likes: 5200, comments: 320, saves: 0 },
  },
  {
    id: 'fallback-3',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    business: {
      id: '',
      name: 'Bella Italia Restaurant',
      handle: '@bellaitalia',
      avatar: 'BI',
      distance: '1.2mi',
    },
    caption: 'Authentic Italian cuisine made with love 🍝 Reserve your table for our special tasting menu this weekend!',
    stats: { likes: 3800, comments: 215, saves: 0 },
  },
];

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

const VIDEOS_PER_PAGE = 10;

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [videos, setVideos] = useState<FeedVideo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTabFocused, setIsTabFocused] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const currentOffset = useRef(0);

  // Calculate the actual viewable height (full screen minus tab bar)
  const videoHeight = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

  // Fetch videos from Supabase (initial load or refresh)
  const fetchVideos = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const fetchedVideos = await getVideosForFeed(VIDEOS_PER_PAGE, 0);
      currentOffset.current = VIDEOS_PER_PAGE;
      
      if (fetchedVideos.length > 0) {
        setVideos(fetchedVideos);
        setHasMoreVideos(fetchedVideos.length === VIDEOS_PER_PAGE);
      } else {
        // Use fallback videos if database is empty
        console.log('No videos in database, using fallback videos');
        setVideos(FALLBACK_VIDEOS);
        setHasMoreVideos(false);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
      // Use fallback videos on error
      setVideos(FALLBACK_VIDEOS);
      setHasMoreVideos(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load more videos (infinite scroll with looping)
  const loadMoreVideos = useCallback(async () => {
    if (isLoadingMore || videos.length === 0) return;

    // If we have more videos to fetch from the database
    if (hasMoreVideos && !videos[0]?.id.startsWith('fallback')) {
      try {
        setIsLoadingMore(true);
        const newVideos = await getVideosForFeed(VIDEOS_PER_PAGE, currentOffset.current);
        
        if (newVideos.length > 0) {
          setVideos(prev => [...prev, ...newVideos]);
          currentOffset.current += VIDEOS_PER_PAGE;
          setHasMoreVideos(newVideos.length === VIDEOS_PER_PAGE);
        } else {
          setHasMoreVideos(false);
        }
      } catch (err) {
        console.error('Error loading more videos:', err);
      } finally {
        setIsLoadingMore(false);
      }
    } else {
      // Loop: Duplicate existing videos with unique keys for infinite scroll
      const loopId = Date.now();
      setVideos(prev => [
        ...prev,
        ...prev.slice(0, Math.min(prev.length, VIDEOS_PER_PAGE)).map((v, i) => ({
          ...v,
          id: `${v.id.split('-loop-')[0]}-loop-${loopId}-${i}`
        }))
      ]);
    }
  }, [isLoadingMore, hasMoreVideos, videos]);

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Track when the Feed tab gains/loses focus
  useFocusEffect(
    useCallback(() => {
      setIsTabFocused(true);
      return () => {
        setIsTabFocused(false);
      };
    }, [])
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleRefresh = useCallback(() => {
    fetchVideos(true);
  }, [fetchVideos]);

  // Footer component for loading more indicator - MUST be before any early returns
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  }, [isLoadingMore]);

  const renderItem = useCallback(({ item, index }: { item: FeedVideo; index: number }) => {
    // Video is only active if it's the current index AND the tab is focused
    const isActive = index === activeIndex && isTabFocused;

    return (
      <View style={[styles.videoItem, { height: videoHeight }]}>
        {/* Video Player */}
        <VideoPlayer uri={item.uri} isActive={isActive} videoHeight={videoHeight} />

        {/* Header Overlay */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.logo}>BizVibe</Text>
          <View style={styles.headerTabs}>
            <Pressable style={styles.headerTabActive}>
              <Text style={styles.headerTabTextActive}>For You</Text>
            </Pressable>
            <Pressable style={styles.headerTab}>
              <Text style={styles.headerTabText}>Following</Text>
            </Pressable>
          </View>
        </View>

        {/* Action Bar - positioned above the tab bar */}
        <View style={styles.actionBar}>
          <Pressable style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Heart size={28} color={colors.white} />
            </View>
            <Text style={styles.actionText}>{formatNumber(item.stats.likes)}</Text>
          </Pressable>
          <Pressable style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <MessageCircle size={28} color={colors.white} />
            </View>
            <Text style={styles.actionText}>{formatNumber(item.stats.comments)}</Text>
          </Pressable>
          <Pressable style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Bookmark size={28} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Save</Text>
          </Pressable>
          <Pressable style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Share2 size={28} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
        </View>

        {/* Business Info - positioned above the tab bar */}
        <View style={styles.businessInfo}>
          <Pressable style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.business.avatar}</Text>
            </View>
            <View style={styles.followBadge}>
              <Plus size={12} color={colors.white} strokeWidth={3} />
            </View>
          </Pressable>
          <View style={styles.businessDetails}>
            <Text style={styles.businessName}>{item.business.name}</Text>
            <Text style={styles.businessHandle}>
              {item.business.handle} • {item.business.distance}
            </Text>
            <Text style={styles.videoCaption} numberOfLines={2}>
              {item.caption}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [activeIndex, isTabFocused, insets, videoHeight]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: videoHeight,
    offset: videoHeight * index,
    index,
  }), [videoHeight]);

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  // Error state with retry
  if (error && videos.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => fetchVideos()}>
          <RefreshCw size={20} color={colors.white} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={videoHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMoreVideos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        progressViewOffset={50}
      />
      {/* Pull-to-refresh indicator overlay */}
      {isRefreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  videoItem: {
    width: '100%',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerTabs: {
    flexDirection: 'row',
    gap: 24,
  },
  headerTab: {
    paddingVertical: 4,
  },
  headerTabActive: {
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  headerTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerTabTextActive: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  actionBar: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    alignItems: 'center',
    gap: 20,
    zIndex: 10,
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  businessInfo: {
    position: 'absolute',
    left: 16,
    right: 80,
    bottom: 16,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  followBadge: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  businessDetails: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  businessHandle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  videoCaption: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  loadingMoreText: {
    color: colors.white,
    fontSize: 14,
  },
  refreshIndicator: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
});
