import { router } from 'expo-router';
import { Bookmark, ChevronRight, Heart, LogIn, LogOut, Settings, Star, User, Video } from 'lucide-react-native';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors, { colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: Bookmark, label: 'Saved Videos', count: 12 },
  { icon: Heart, label: 'Liked', count: 48 },
  { icon: Video, label: 'Watch History', count: null },
  { icon: Star, label: 'My Reviews', count: 5 },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const navigateToSignIn = () => {
    router.push('/(auth)/sign-in' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        <Pressable>
          <Settings size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Show different content based on auth state */}
        {user && profile ? (
          /* Logged In User Profile */
          <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
            <View style={styles.profileHeader}>
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary[500] }]}>
                  <User size={32} color={colors.white} />
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {profile.name || 'User'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                  {profile.email}
                </Text>
                <View style={[styles.roleBadge, { backgroundColor: colors.primary[100] }]}>
                  <Text style={[styles.roleText, { color: colors.primary[600] }]}>
                    {profile.role === 'business' ? 'Business Account' : 'Consumer'}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable 
              style={[styles.editButton, { borderColor: theme.border }]}
            >
              <Text style={[styles.editButtonText, { color: theme.text }]}>Edit Profile</Text>
            </Pressable>
          </View>
        ) : (
          /* Sign In Card for non-authenticated users */
          <View style={[styles.signInCard, { backgroundColor: colors.primary[500] }]}>
            <View style={styles.signInIcon}>
              <LogIn size={32} color={colors.white} />
            </View>
            <View style={styles.signInContent}>
              <Text style={styles.signInTitle}>Sign In to BizVibe</Text>
              <Text style={styles.signInText}>
                Save favorites, message businesses, and get personalized recommendations
              </Text>
            </View>
            <Pressable style={styles.signInButton} onPress={navigateToSignIn}>
              <Text style={[styles.signInButtonText, { color: colors.primary[500] }]}>Sign In</Text>
            </Pressable>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Following</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Wishlist</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Orders</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { borderColor: theme.border }]}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={item.label}
              style={[
                styles.menuItem, 
                index !== menuItems.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }
              ]}
            >
              <item.icon size={22} color={theme.textSecondary} />
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.count !== null && (
                  <Text style={[styles.menuCount, { color: theme.textSecondary }]}>{item.count}</Text>
                )}
                <ChevronRight size={20} color={theme.textSecondary} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Business Mode - Only show for consumer accounts */}
        {(!profile || profile.role !== 'business') && (
          <Pressable style={[styles.businessCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.businessContent}>
              <Text style={[styles.businessTitle, { color: theme.text }]}>Are you a business?</Text>
              <Text style={[styles.businessText, { color: theme.textSecondary }]}>
                Create videos, reach customers, and grow your business
              </Text>
            </View>
            <Pressable style={[styles.businessButton, { borderColor: colors.primary[500] }]}>
              <Text style={[styles.businessButtonText, { color: colors.primary[500] }]}>Switch to Business</Text>
            </Pressable>
          </Pressable>
        )}

        {/* Sign Out Button - Only show when logged in */}
        {user && (
          <Pressable 
            style={[styles.signOutButton, { borderColor: colors.error }]}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
          </Pressable>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signInCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  signInIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  signInTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  signInText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  signInButton: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuCount: {
    fontSize: 14,
  },
  businessCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  businessContent: {
    marginBottom: 16,
  },
  businessTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  businessText: {
    fontSize: 14,
  },
  businessButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  businessButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
