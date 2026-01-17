import { Bell, MessageCircle, ShoppingBag, Star } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors, { colors } from '@/constants/Colors';

const mockConversations = [
  {
    id: 1,
    name: 'Coffee Beans Cafe',
    avatar: 'CB',
    lastMessage: 'Great! Your order will be ready at 2pm',
    time: '2m',
    unread: true,
  },
  {
    id: 2,
    name: 'Urban Style Boutique',
    avatar: 'US',
    lastMessage: 'We have the size you asked for!',
    time: '1h',
    unread: true,
  },
  {
    id: 3,
    name: 'Green Garden Services',
    avatar: 'GG',
    lastMessage: 'Thanks for your review! 🌱',
    time: '3h',
    unread: false,
  },
];

const tabs = [
  { name: 'Messages', icon: MessageCircle },
  { name: 'Notifications', icon: Bell },
  { name: 'Orders', icon: ShoppingBag },
];

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Inbox</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <Pressable 
            key={tab.name}
            style={[
              styles.tab, 
              index === 0 && styles.tabActive,
              { borderColor: index === 0 ? colors.primary[500] : 'transparent' }
            ]}
          >
            <tab.icon 
              size={20} 
              color={index === 0 ? colors.primary[500] : theme.textSecondary} 
            />
            <Text 
              style={[
                styles.tabText, 
                { color: index === 0 ? colors.primary[500] : theme.textSecondary }
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Messages List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {mockConversations.map((convo) => (
          <Pressable 
            key={convo.id} 
            style={[styles.conversationItem, { borderBottomColor: theme.border }]}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primary[500] }]}>
              <Text style={styles.avatarText}>{convo.avatar}</Text>
            </View>
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={[styles.conversationName, { color: theme.text }]}>{convo.name}</Text>
                <Text style={[styles.conversationTime, { color: theme.textSecondary }]}>{convo.time}</Text>
              </View>
              <Text 
                style={[
                  styles.conversationMessage, 
                  { color: convo.unread ? theme.text : theme.textSecondary }
                ]}
                numberOfLines={1}
              >
                {convo.lastMessage}
              </Text>
            </View>
            {convo.unread && <View style={[styles.unreadDot, { backgroundColor: colors.primary[500] }]} />}
          </Pressable>
        ))}

        {/* Empty state for reviews */}
        <View style={[styles.reviewPrompt, { backgroundColor: theme.surface }]}>
          <Star size={24} color={colors.warning} />
          <View style={styles.reviewContent}>
            <Text style={[styles.reviewTitle, { color: theme.text }]}>Leave a Review</Text>
            <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
              Share your experience with businesses you've visited
            </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabActive: {
    backgroundColor: `${colors.primary[500]}10`,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  conversationTime: {
    fontSize: 12,
  },
  conversationMessage: {
    fontSize: 14,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reviewPrompt: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
  },
});
