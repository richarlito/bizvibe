import { getSupabase } from './supabase';

// Types for video data
export interface VideoWithBusiness {
  id: string;
  video_url: string;
  thumbnail_url: string | null;
  title: string;
  description: string | null;
  duration: number | null;
  views_count: number;
  saves_count: number;
  created_at: string;
  business: {
    id: string;
    name: string;
    handle: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface FeedVideo {
  id: string;
  uri: string;
  business: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    distance: string; // Will be calculated later with location
  };
  caption: string;
  stats: {
    likes: number;
    comments: number;
    saves: number;
  };
}

/**
 * Fetch videos for the main feed
 * Returns videos with business info, ordered by most recent
 */
export async function getVideosForFeed(
  limit: number = 10,
  offset: number = 0
): Promise<FeedVideo[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      video_url,
      thumbnail_url,
      title,
      description,
      duration,
      views_count,
      saves_count,
      created_at,
      business:businesses (
        id,
        name,
        handle,
        avatar_url,
        is_verified
      ),
      category:categories (
        id,
        name,
        slug
      )
    `)
    .eq('status', 'ready')
    .not('video_url', 'is', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }

  // Transform to FeedVideo format
  return (data || []).map((video: any) => ({
    id: video.id,
    uri: video.video_url,
    business: {
      id: video.business?.id || '',
      name: video.business?.name || 'Unknown Business',
      handle: video.business?.handle ? `@${video.business.handle}` : '@unknown',
      avatar: getInitials(video.business?.name || 'UB'),
      distance: '0.5mi', // TODO: Calculate with user location
    },
    caption: video.description || video.title || '',
    stats: {
      likes: video.views_count || 0, // Using views as proxy for now
      comments: 0, // TODO: Add comments count when implemented
      saves: video.saves_count || 0,
    },
  }));
}

/**
 * Get a single video by ID
 */
export async function getVideoById(videoId: string): Promise<VideoWithBusiness | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      video_url,
      thumbnail_url,
      title,
      description,
      duration,
      views_count,
      saves_count,
      created_at,
      business:businesses (
        id,
        name,
        handle,
        avatar_url,
        is_verified
      ),
      category:categories (
        id,
        name,
        slug
      )
    `)
    .eq('id', videoId)
    .single();

  if (error) {
    console.error('Error fetching video:', error);
    return null;
  }

  return data as unknown as VideoWithBusiness;
}

/**
 * Increment view count for a video
 * Uses the database RPC function for atomic increment
 */
export async function incrementVideoViews(videoId: string): Promise<void> {
  try {
    const supabase = getSupabase();
    // Call the RPC function defined in the database
    await (supabase as any).rpc('increment_video_views', { video_id: videoId });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

/**
 * Check if user has saved a video
 */
export async function isVideoSaved(videoId: string, userId: string): Promise<boolean> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('saves')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking save status:', error);
    return false;
  }

  return !!data;
}

/**
 * Toggle save status for a video
 */
export async function toggleVideoSave(
  videoId: string,
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();

  // Check if already saved
  const isSaved = await isVideoSaved(videoId, userId);

  if (isSaved) {
    // Remove save
    const { error } = await supabase
      .from('saves')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing save:', error);
      throw error;
    }
    return false;
  } else {
    // Add save - use type assertion for insert
    const { error } = await supabase
      .from('saves')
      .insert({ video_id: videoId, user_id: userId } as any);

    if (error) {
      console.error('Error adding save:', error);
      throw error;
    }
    return true;
  }
}

/**
 * Get videos for a specific business
 */
export async function getBusinessVideos(
  businessId: string,
  limit: number = 20
): Promise<FeedVideo[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      video_url,
      thumbnail_url,
      title,
      description,
      views_count,
      saves_count,
      created_at,
      business:businesses (
        id,
        name,
        handle,
        avatar_url
      )
    `)
    .eq('business_id', businessId)
    .eq('status', 'ready')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching business videos:', error);
    throw error;
  }

  return (data || []).map((video: any) => ({
    id: video.id,
    uri: video.video_url,
    business: {
      id: video.business?.id || '',
      name: video.business?.name || 'Unknown',
      handle: video.business?.handle ? `@${video.business.handle}` : '@unknown',
      avatar: getInitials(video.business?.name || 'UB'),
      distance: '0mi',
    },
    caption: video.description || video.title || '',
    stats: {
      likes: video.views_count || 0,
      comments: 0,
      saves: video.saves_count || 0,
    },
  }));
}

// Helper function to get initials from business name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
