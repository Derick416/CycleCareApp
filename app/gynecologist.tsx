import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const doctors = [
  {
    name: 'Dr. Sarah Nansubuga',
    subtitle: 'Specialist in reproductive health, Kampala',
    phone: '+256772123456',
    phoneDisplay: '+256 772 123456',
    website: 'https://www.medpages.info/specialists/gynecologists',
    websiteLabel: 'Medpages Directory',
  },
  {
    name: 'Dr. James Okello',
    subtitle: 'Obstetrician/Gynecologist, Entebbe',
    phone: '+256701654321',
    phoneDisplay: '+256 701 654321',
    website: 'https://www.medpages.info/specialists/gynecologists',
    websiteLabel: 'Medpages Directory',
  },
];

export default function GynecologistPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.intro}>
        Certified gynecologists across Uganda and abroad provide consultations for reproductive health, fertility, menstrual disorders, and preventive screenings.
      </Text>
      {doctors.map((doc) => (
        <View key={doc.name} style={styles.card}>
          <Ionicons name="person" size={28} color="#FF69B4" />
          <View style={styles.info}>
            <Text style={styles.name}>{doc.name}</Text>
            <Text style={styles.subtitle}>{doc.subtitle}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${doc.phone}`)}>
              <Text style={styles.link}>📞 {doc.phoneDisplay}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(doc.website)}>
              <Text style={styles.link}>🌐 {doc.websiteLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  intro: { fontSize: 15, color: '#444', marginBottom: 16, lineHeight: 22 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  info: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  subtitle: { color: '#666', fontSize: 13, marginBottom: 6 },
  link: { color: '#2196F3', fontSize: 13, marginTop: 4, textDecorationLine: 'underline' },
});
