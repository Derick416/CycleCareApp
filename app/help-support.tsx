import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const supportItems = [
  {
    title: 'Frequently Asked Questions',
    description: 'Learn how to log your period, edit entries, and manage reminders.',
    icon: 'chatbubble-ellipses' as const,
    route: '/faq',
  },
  {
    title: 'Contact Support',
    description: 'Reach out to our team for help.',
    icon: 'headset' as const,
    route: '/contact-support',
  },
  {
    title: 'Trusted Health Resources',
    description: 'Access reliable menstrual health information.',
    icon: 'shield-checkmark' as const,
    route: '/health-resources',
  },
  {
    title: 'Community Forum & Live Chat',
    description: 'Join discussions or chat with our bot.',
    icon: 'people' as const,
    route: '/chatbot',
  },
];

const notes = [
  '"You are not alone — menstrual health is part of overall well‑being."',
  '"Tracking your cycle empowers you to understand your body better."',
  '"Seeking help is a sign of strength — never hesitate to reach out."',
];

export default function HelpSupportPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Help & Support</Text>

      {supportItems.map((item) => (
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

      <Text style={styles.sectionTitle}>Encouraging Notes</Text>
      {notes.map((note) => (
        <Text key={note} style={styles.note}>{note}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', padding: 16, paddingBottom: 8 },
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
  note: { fontStyle: 'italic', color: '#888', paddingHorizontal: 16, paddingVertical: 6, fontSize: 14 },
});
