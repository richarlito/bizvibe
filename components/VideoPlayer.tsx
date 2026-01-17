import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerProps {
  uri: string;
  isActive: boolean;
  onVideoEnd?: () => void;
}

export default function VideoPlayer({ uri, isActive, onVideoEnd }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Handle active state changes (when video comes into view or leaves)
  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
      videoRef.current?.setPositionAsync(0);
    }
  }, [isActive]);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
    setIsPlaying(status.isPlaying);

    // Loop video when it ends
    if (status.didJustFinish) {
      videoRef.current?.replayAsync();
      onVideoEnd?.();
    }
  }, [onVideoEnd]);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current) return;

    setShowControls(true);
    setTimeout(() => setShowControls(false), 1500);

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <Pressable style={styles.container} onPress={togglePlayPause}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted={isMuted}
        shouldPlay={isActive}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls={false}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}

      {/* Play/Pause Overlay */}
      {showControls && !isLoading && (
        <View style={styles.controlsOverlay}>
          <View style={styles.playPauseButton}>
            {isPlaying ? (
              <Pause size={50} color={colors.white} fill={colors.white} />
            ) : (
              <Play size={50} color={colors.white} fill={colors.white} />
            )}
          </View>
        </View>
      )}

      {/* Mute Button */}
      <Pressable style={styles.muteButton} onPress={toggleMute}>
        {isMuted ? (
          <VolumeX size={22} color={colors.white} />
        ) : (
          <Volume2 size={22} color={colors.white} />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.black,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
  muteButton: {
    position: 'absolute',
    top: 100,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
