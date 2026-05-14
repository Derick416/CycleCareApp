import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';

export default function CommunityForumPage() {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.iconWrap, { backgroundColor: '#E8F5E9' }]}>
        <MaterialIcons name="groups" size={60} color="#2E7D32" />
      </View>
      <Text style={[styles.title, { color: c.text }]}>Community Forum</Text>
      <Text style={[styles.sub, { color: c.textSecondary }]}>
        A safe space for women to share experiences, ask questions, and support each other.
      </Text>
      <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
        <MaterialIcons name="build" size={14} color="#2E7D32" />
        <Text style={styles.badgeText}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap: { width: 100, height: 100, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  sub: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  badgeText: { color: '#2E7D32', fontWeight: '700', fontSize: 13 },
});
