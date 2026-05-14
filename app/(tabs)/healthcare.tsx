import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/ThemeContext';

const resources = [
  {
    title: 'Find a Gynecologist',
    description: 'Search for certified gynecologists in Uganda and abroad.',
    icon: 'person-search' as const,
    iconBg: '#FCE4EC', iconColor: '#C2185B',
    route: '/gynecologist',
  },
  {
    title: 'International Gynecology Network',
    description: 'Access global gynecology experts and FIGO resources.',
    icon: 'public' as const,
    iconBg: '#E3F2FD', iconColor: '#1565C0',
    route: '/international-network',
  },
  {
    title: 'Kabale Regional Referral Hospital',
    description: 'Menstrual health and gynecology services in Kabale district.',
    icon: 'local-hospital' as const,
    iconBg: '#E8F5E9', iconColor: '#2E7D32',
    route: '/kabale-hospital',
  },
  {
    title: 'Rugarama Hospital',
    description: 'Community hospital offering reproductive health services.',
    icon: 'healing' as const,
    iconBg: '#FFF3E0', iconColor: '#E65100',
    route: '/rugarama-hospital',
  },
  {
    title: "Women's Health Magazine",
    description: "Expert advice on your cycle, body, and overall well-being.",
    icon: 'spa' as const,
    iconBg: '#F3E5F5', iconColor: '#7B1FA2',
    route: '/womens-health',
  },
  {
    title: 'Health Resources',
    description: 'WHO, UNICEF, CDC, and trusted menstrual health info.',
    icon: 'article' as const,
    iconBg: '#FCE4EC', iconColor: '#C2185B',
    route: '/health-resources',
  },
];

const quotes = [
  { text: 'Your health is your wealth — never hesitate to seek care.', icon: 'format-quote' as const },
  { text: 'Visiting a doctor is a sign of strength, not weakness.', icon: 'format-quote' as const },
];

export default function HealthcarePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 32 }}>

      {/* Header bar */}
      <View style={[styles.headerBar, { backgroundColor: '#880E4F' }]}>
        <MaterialIcons name="local-hospital" size={24} color="#fff" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Healthcare Resources</Text>
          <Text style={styles.headerSub}>Find care near you & worldwide</Text>
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>RESOURCES</Text>

      {resources.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={[styles.card, { backgroundColor: c.surface }]}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
            <MaterialIcons name={item.icon} size={26} color={item.iconColor} />
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: c.text }]}>{item.title}</Text>
            <Text style={[styles.cardDesc, { color: c.textSecondary }]}>{item.description}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={c.textSecondary} />
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>WORDS TO LIVE BY</Text>
      {quotes.map((q) => (
        <View key={q.text} style={[styles.quoteCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <MaterialIcons name="format-quote" size={20} color="#C2185B" />
          <Text style={[styles.quoteText, { color: c.textSecondary }]}>{q.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, paddingTop: 28,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
    marginHorizontal: 16, marginTop: 18, marginBottom: 10,
  },
  card: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 16, padding: 14, gap: 12,
    elevation: 2, shadowColor: '#C2185B',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  cardDesc: { fontSize: 12, marginTop: 2, lineHeight: 17 },

  quoteCard: {
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 14, padding: 14,
    flexDirection: 'row', gap: 10,
    borderWidth: 1,
  },
  quoteText: { flex: 1, fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
});
