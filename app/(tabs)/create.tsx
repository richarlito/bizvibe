import { Camera, Upload, Video, Wand2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors, { colors } from '@/constants/Colors';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Create</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Showcase your business to the world
        </Text>
      </View>

      {/* Main Actions */}
      <View style={styles.content}>
        {/* Record Video */}
        <Pressable style={[styles.mainCard, { backgroundColor: colors.primary[500] }]}>
          <View style={styles.cardIcon}>
            <Camera size={48} color={colors.white} />
          </View>
          <Text style={styles.cardTitle}>Record Video</Text>
          <Text style={styles.cardDescription}>
            Create a 15-60 second video to showcase your products or services
          </Text>
        </Pressable>

        {/* Secondary Actions */}
        <View style={styles.secondaryRow}>
          <Pressable style={[styles.secondaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Upload size={28} color={colors.secondary[500]} />
            <Text style={[styles.secondaryTitle, { color: theme.text }]}>Upload</Text>
            <Text style={[styles.secondaryDesc, { color: theme.textSecondary }]}>From gallery</Text>
          </Pressable>

          <Pressable style={[styles.secondaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Wand2 size={28} color={colors.warning} />
            <Text style={[styles.secondaryTitle, { color: theme.text }]}>AI Edit</Text>
            <Text style={[styles.secondaryDesc, { color: theme.textSecondary }]}>Auto enhance</Text>
          </Pressable>
        </View>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Video size={24} color={colors.primary[500]} />
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, { color: theme.text }]}>Tips for Great Videos</Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              • Good lighting makes a difference{'\n'}
              • Show your products in action{'\n'}
              • Keep it under 60 seconds{'\n'}
              • Add captions for accessibility
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  secondaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryDesc: {
    fontSize: 12,
  },
  tipsCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
