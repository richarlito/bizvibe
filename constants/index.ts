export * from './colors';
export * from './spacing';
export * from './typography';

// App categories
export const categories = [
  { id: 'local-eats', name: 'Local Eats', icon: '🍽️', color: '#FF6B42' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: '#EC4899' },
  { id: 'home-services', name: 'Home Services', icon: '🏠', color: '#3B82F6' },
  { id: 'health-beauty', name: 'Health & Beauty', icon: '💆', color: '#8B5CF6' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: '#10B981' },
  { id: 'tech-gadgets', name: 'Tech & Gadgets', icon: '📱', color: '#6366F1' },
  { id: 'arts-crafts', name: 'Arts & Crafts', icon: '🎨', color: '#F59E0B' },
  { id: 'eco-friendly', name: 'Eco-Friendly', icon: '🌱', color: '#22C55E' },
] as const;

export type CategoryId = typeof categories[number]['id'];
