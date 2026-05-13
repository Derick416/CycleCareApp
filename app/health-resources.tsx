import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const open = (url: string) => Linking.openURL(url);

const quickLinks = [
  { label: 'CDC', url: 'https://www.cdc.gov/wash/healthy-habits/menstrual-hygiene.html', icon: 'medical' as const, color: '#F44336' },
  { label: "Office on Women's Health", url: 'https://www.womenshealth.gov/menstrual-cycle', icon: 'heart' as const, color: '#FF69B4' },
  { label: 'NIH', url: 'https://www.nichd.nih.gov/health/topics/menstruation', icon: 'flask' as const, color: '#4CAF50' },
];

export default function HealthResourcesPage() {
  const [unicefExpanded, setUnicefExpanded] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* WHO Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => open('https://www.who.int/news/item/22-06-2022-who-statement-on-menstrual-health-and-rights')}
      >
        <Ionicons name="globe" size={24} color="#2196F3" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>World Health Organization (WHO)</Text>
          <Text style={styles.cardDesc}>Statement on menstrual health and rights</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
      </TouchableOpacity>

      {/* UNICEF Expandable */}
      <TouchableOpacity style={styles.card} onPress={() => setUnicefExpanded(!unicefExpanded)}>
        <Ionicons name="happy" size={24} color="#FF9800" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>UNICEF</Text>
        </View>
        <Ionicons name={unicefExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#9E9E9E" />
      </TouchableOpacity>
      {unicefExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedText}>
            Guidance on menstrual health and hygiene, addressing stigma and access to resources.
          </Text>
          <TouchableOpacity onPress={() => open('https://www.unicef.org/wash/menstrual-hygiene')}>
            <Text style={styles.link}>Visit UNICEF Resource</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick links */}
      <Text style={styles.sectionTitle}>Quick Links</Text>
      <View style={styles.chipsRow}>
        {quickLinks.map((item) => (
          <TouchableOpacity key={item.label} style={styles.chip} onPress={() => open(item.url)}>
            <Ionicons name={item.icon} size={16} color={item.color} />
            <Text style={styles.chipLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Plan International */}
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Plan International</Text>
        <Text style={styles.planDesc}>
          Global advocacy to end period poverty and stigma, supporting menstrual health.
        </Text>
        <TouchableOpacity onPress={() => open('https://plan-international.org/sexual-health/menstruation')}>
          <Text style={styles.link}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Global Hub button */}
      <TouchableOpacity
        style={styles.hubBtn}
        onPress={() => open('https://menstrualhealthhub.org')}
      >
        <Ionicons name="globe" size={18} color="#fff" />
        <Text style={styles.hubBtnText}>Global Menstrual Health Hub</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
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
  expandedContent: {
    backgroundColor: '#f9f0ff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    marginTop: -4,
  },
  expandedText: { fontSize: 14, color: '#444', marginBottom: 8 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 8, marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  chipLabel: { fontSize: 13 },
  planCard: {
    backgroundColor: '#f3e5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ce93d8',
    padding: 16,
    marginBottom: 16,
  },
  planTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  planDesc: { fontSize: 14, color: '#444', marginBottom: 8 },
  link: { color: '#9C27B0', fontWeight: '600', fontSize: 14 },
  hubBtn: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  hubBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
