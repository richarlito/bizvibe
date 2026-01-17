import { Bookmark, Heart, MessageCircle, Plus, Share2 } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import VideoPlayer from '@/components/VideoPlayer';
import { colors } from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample video data for testing
const SAMPLE_VIDEOS = [
  {
    id: '1',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    business: {
      name: 'Coffee Beans Cafe',
      handle: '@coffeebeans',
      avatar: 'CB',
      distance: '0.3mi',
    },
    caption: 'Fresh roasted beans every morning! ☕ Come try our new seasonal blend and get 20% off your first order.',
    stats: {
      likes: 2400,
      comments: 148,
    },
  },
  {
    id: '2',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    business: {
      name: 'Urban Fitness Studio',
      handle: '@urbanfitness',
      avatar: 'UF',
      distance: '0.8mi',
    },
    caption: 'Transform your body in 30 days! 💪 New member special: First month FREE with annual membership.',
    stats: {
      likes: 5200,
      comments: 320,
    },
  },
  {
    id: '3',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    business: {
      name: 'Bella Italia Restaurant',
      handle: '@bellaitalia',
      avatar: 'BI',
      distance: '1.2mi',
    },
    caption: 'Authentic Italian cuisine made with love 🍝 Reserve your table for our special tasting menu this weekend!',
    stats: {
      likes: 3800,
      comments: 215,
    },
  },
  {
    id: '4',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    business: {
      name: 'Tech Repair Pro',
      handle: '@techrepairpro',
      avatar: 'TR',
      distance: '0.5mi',
    },
    caption: 'Screen cracked? We fix it in 30 minutes or less! 📱 Same-day repairs for all phone models.',
    stats: {
      likes: 1800,
      comments: 89,
    },
  },
  {
    id: '5',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    business: {
      name: 'Zen Spa & Wellness',
      handle: '@zenspa',
      avatar: 'ZS',
      distance: '1.5mi',
    },
    caption: 'Escape the stress of daily life 🧘‍♀️ Book a 90-minute massage and get a free facial treatment.',
    stats: {
      likes: 4100,
      comments: 267,
    },
  },
];

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

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(({ item, index }: { item: VideoItem; index: number }) => {
    const isActive = index === activeIndex;

    return (
      <View style={styles.videoItem}>
        {/* Video Player */}
        <VideoPlayer uri={item.uri} isActive={isActive} />

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

        {/* Action Bar */}
        <View style={[styles.actionBar, { bottom: insets.bottom + 120 }]}>
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

        {/* Business Info */}
        <View style={[styles.businessInfo, { bottom: insets.bottom + 20 }]}>
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
  }, [activeIndex, insets]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: SCREEN_HEIGHT,
    offset: SCREEN_HEIGHT * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SAMPLE_VIDEOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  videoItem: {
    width: '100%',
    height: SCREEN_HEIGHT,
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
});
