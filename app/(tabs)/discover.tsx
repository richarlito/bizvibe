import { Coffee, Leaf, MapPin, Search, Shirt, Sparkles, TrendingUp, Wrench } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors, { colors } from '@/constants/Colors';

const categories = [
  { name: 'Local Eats', icon: Coffee, color: colors.primary[500] },
  { name: 'Fashion', icon: Shirt, color: colors.secondary[500] },
  { name: 'Services', icon: Wrench, color: colors.warning },
  { name: 'Eco-Friendly', icon: Leaf, color: colors.success },
  { name: 'Beauty', icon: Sparkles, color: '#E879F9' },
  { name: 'Trending', icon: TrendingUp, color: colors.error },
];

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Discover</Text>
        <Pressable style={styles.locationButton}>
          <MapPin size={18} color={colors.primary[500]} />
          <Text style={[styles.locationText, { color: colors.primary[500] }]}>San Francisco</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search businesses..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable 
                key={category.name} 
                style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={[styles.categoryName, { color: theme.text }]}>{category.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Near You */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Near You</Text>
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <MapPin size={32} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Enable location to find nearby businesses
            </Text>
            <Pressable style={[styles.enableButton, { backgroundColor: colors.primary[500] }]}>
              <Text style={styles.enableButtonText}>Enable Location</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  enableButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  enableButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
