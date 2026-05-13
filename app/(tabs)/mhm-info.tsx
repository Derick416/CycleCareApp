import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INFO_CARDS = [
  {
    title: 'What to Expect',
    description: 'Your cycle is a natural part of health. Tracking helps you prepare and understand your body better.',
    icon: 'information-circle' as const,
  },
  {
    title: 'Managing Your Period',
    description: "Stay hydrated, rest when needed, and use clean products. It's okay to take things slow during this time.",
    icon: 'heart' as const,
  },
  {
    title: 'Supplies You May Need',
    description: 'Pads, tampons, or reusable products. Pain relief if needed. Clean water and soap for hygiene.',
    icon: 'bag' as const,
  },
  {
    title: 'When to Seek Help',
    description: 'If you experience severe pain, very heavy flow, or have concerns, reach out to a healthcare provider.',
    icon: 'medkit' as const,
  },
];

const DOWNLOADS = [
  {
    title: 'Complete Guide to Menstrual Health',
    description: 'Comprehensive menstrual health and hygiene guidance by UNICEF',
    size: '2.3 MB',
    url: 'https://www.unicef.org/media/91341/file/Guidance%20on%20Menstrual%20Health%20and%20Hygiene%202019.pdf',
  },
  {
    title: 'Nutrition & Exercise Tips',
    description: 'Scientific insights on how diet and physical activity affect menstrual cycles',
    size: '1.8 MB',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6775480/pdf/biolsport-14-4-251.pdf',
  },
  {
    title: 'Understanding the Menstrual Cycle',
    description: 'Phases, hormones, and safe/unsafe days',
    size: '1.2 MB',
    url: 'https://www.gynaecologyjournal.com/articles/1581/9-1-177-180.pdf',
  },
  {
    title: 'Hygiene Best Practices',
    description: 'WHO guidance on menstrual hygiene and safe practices',
    size: '2.5 MB',
    url: 'https://apps.who.int/iris/bitstream/handle/10665/329948/9789241515630-eng.pdf',
  },
  {
    title: 'Mental Health & Periods',
    description: 'BMJ Mental Health journal article on emotional wellbeing during menstrual cycles',
    size: '1.5 MB',
    url: 'https://mentalhealth.bmj.com/content/28/1/1.full.pdf',
  },
];

export default function MhmInfoPage() {
  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open link'));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Menstrual Health Information</Text>

      {INFO_CARDS.map((card) => (
        <View key={card.title} style={styles.card}>
          <Ionicons name={card.icon} size={28} color="#FF69B4" style={styles.cardIcon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDesc}>{card.description}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Downloadable Resources</Text>

      {DOWNLOADS.map((item) => (
        <View key={item.title} style={styles.downloadCard}>
          <Ionicons name="document-text" size={28} color="#FF69B4" />
          <View style={styles.downloadText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <Text style={styles.size}>Size: {item.size}</Text>
          </View>
          <TouchableOpacity style={styles.downloadBtn} onPress={() => openUrl(item.url)}>
            <Text style={styles.downloadBtnText}>Open</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: { marginRight: 12, marginTop: 2 },
  cardText: { flex: 1 },
  cardTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  cardDesc: { color: '#555', fontSize: 14 },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: 10,
  },
  downloadText: { flex: 1 },
  size: { fontSize: 12, color: '#888', marginTop: 2 },
  downloadBtn: {
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  downloadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
