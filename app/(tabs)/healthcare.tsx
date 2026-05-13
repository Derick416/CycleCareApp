import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const resources = [
  {
    title: 'Find a Gynecologist Near You',
    description: 'Search for certified gynecologists in Uganda and abroad.',
    icon: 'location' as const,
    route: '/gynecologist',
  },
  {
    title: 'International Gynecology Network',
    description: 'Access global gynecology experts and resources.',
    icon: 'globe' as const,
    route: '/international-network',
  },
  {
    title: 'Kabale Regional Referral Hospital',
    description: 'Menstrual health and gynecology services in Kabale district.',
    icon: 'medical' as const,
    route: '/kabale-hospital',
  },
  {
    title: 'Rugarama Hospital Kabale',
    description: 'Community hospital offering reproductive health services.',
    icon: 'medical' as const,
    route: '/rugarama-hospital',
  },
  {
    title: "Women's Health",
    description: 'What you need to know about your menstrual cycle',
    icon: 'heart' as const,
    route: '/womens-health',
  },
];

const quotes = [
  '"Your health is your wealth — never hesitate to seek care."',
  '"Strong women prioritize their well-being; visiting a doctor is a sign of strength."',
];

export default function HealthcarePage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Healthcare Resources</Text>

      {resources.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          onPress={() => router.push(item.route as any)}
        >
          <Ionicons name={item.icon} size={26} color="#FF69B4" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FF69B4" />
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Advising Quotes</Text>
      {quotes.map((q) => (
        <Text key={q} style={styles.quote}>{q}</Text>
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
  quote: {
    fontStyle: 'italic',
    color: '#888',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
});
