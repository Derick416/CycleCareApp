import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const settingsItems = [
  {
    title: 'Privacy & Security',
    description: 'Manage biometric lock, data sharing, and export options',
    icon: 'lock-closed' as const,
    route: '/privacy-security',
  },
  {
    title: 'Notifications',
    description: 'Customize reminders for cycles, fertile windows, and daily logs',
    icon: 'notifications' as const,
    route: '/notifications-settings',
  },
  {
    title: 'Help & Support',
    description: 'FAQs, contact support, and trusted health resources',
    icon: 'help-circle' as const,
    route: '/help-support',
  },
  {
    title: 'Community Forum',
    description: 'Join discussions and connect with others',
    icon: 'people' as const,
    route: '/community-forum',
  },
  {
    title: 'Log Out',
    description: 'Sign out of the app securely',
    icon: 'exit' as const,
    route: '/logout',
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {settingsItems.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
        >
          <Ionicons name={item.icon} size={24} color="#FF69B4" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', padding: 16, paddingBottom: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { fontWeight: 'bold', fontSize: 15 },
  cardDesc: { color: '#555', fontSize: 13, marginTop: 2 },
});
